const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Job = require("../models/Job");
const Applicant = require("../models/Applicant");

// Simple admin auth middleware
const adminAuth = (req, res, next) => {
  const key = req.headers["x-admin-key"];
  if (key !== process.env.ADMIN_KEY) return res.status(403).json({ error: "Unauthorized" });
  next();
};

// ── STATS ────────────────────────────────────────────────────
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalApplicants, employers, freelancers] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Applicant.countDocuments(),
      User.countDocuments({ role: "employer" }),
      User.countDocuments({ role: "freelancer" }),
    ]);
    const hiredCount = await Applicant.countDocuments({ status: "hired" });
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5);
    res.json({ totalUsers, totalJobs, totalApplicants, employers, freelancers, hiredCount, recentJobs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── ALL USERS ────────────────────────────────────────────────
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── DELETE USER ──────────────────────────────────────────────
router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── ALL JOBS ─────────────────────────────────────────────────
router.get("/jobs", adminAuth, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── DELETE JOB ───────────────────────────────────────────────
router.delete("/jobs/:id", adminAuth, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    await Applicant.deleteMany({ jobId: req.params.id });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── ALL APPLICATIONS ─────────────────────────────────────────
router.get("/applications", adminAuth, async (req, res) => {
  try {
    const apps = await Applicant.find().sort({ appliedAt: -1 })
      .populate("jobId", "title budget");
    res.json(apps);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;