const express = require("express");
const router = express.Router();

// ── Middleware: verify admin key ──────────────────────────────────────────────
const ADMIN_KEY = process.env.ADMIN_KEY || "bharat_admin_secret_2025";

function adminAuth(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (!key || key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid admin key" });
  }
  next();
}

// Apply auth middleware to all admin routes
router.use(adminAuth);

// ── Lazy-load models (avoids circular dep issues) ─────────────────────────────
const getModels = () => {
  const User = require("../models/User");
  const Job  = require("../models/Job");

  const Application = require("../models/Applicant");

  return { User, Job, Application };
};

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const { User, Job, Application } = getModels();

    const [
      totalUsers,
      freelancers,
      employers,
      totalJobs,
      totalApplicants,
      hiredCount,
      recentJobs,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "freelancer" }),
      User.countDocuments({ role: "employer" }),
      Job.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: "hired" }),
      Job.find().sort({ createdAt: -1 }).limit(5).select("title category budget createdAt"),
    ]);

    res.json({ totalUsers, freelancers, employers, totalJobs, totalApplicants, hiredCount, recentJobs });
  } catch (err) {
    console.error("Admin stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ── GET /api/admin/users ──────────────────────────────────────────────────────
router.get("/users", async (req, res) => {
  try {
    const { User } = getModels();
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(500);
    res.json(users);
  } catch (err) {
    console.error("Admin users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ── DELETE /api/admin/users/:id ───────────────────────────────────────────────
router.delete("/users/:id", async (req, res) => {
  try {
    const { User, Application } = getModels();
    const user = await User.findByIdAndDelete(req.params.id);
    // Cascade: delete their applications too
    if (user?.email) await Application.deleteMany({ email: user.email });
    res.json({ success: true, msg: "User deleted" });
  } catch (err) {
    console.error("Admin delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// ── GET /api/admin/jobs ───────────────────────────────────────────────────────
router.get("/jobs", async (req, res) => {
  try {
    const { Job } = getModels();
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(500);
    res.json(jobs);
  } catch (err) {
    console.error("Admin jobs error:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// ── DELETE /api/admin/jobs/:id ────────────────────────────────────────────────
router.delete("/jobs/:id", async (req, res) => {
  try {
    const { Job, Application } = getModels();
    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ jobId: req.params.id });
    res.json({ success: true, msg: "Job and its applications deleted" });
  } catch (err) {
    console.error("Admin delete job error:", err);
    res.status(500).json({ error: "Failed to delete job" });
  }
});

// ── GET /api/admin/applications ───────────────────────────────────────────────
router.get("/applications", async (req, res) => {
  try {
    const { Application } = getModels();
    const apps = await Application.find()
      .populate("jobId", "title budget category")
      .sort({ appliedAt: -1 })
      .limit(500);
    res.json(apps);
  } catch (err) {
    console.error("Admin applications error:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

module.exports = router;