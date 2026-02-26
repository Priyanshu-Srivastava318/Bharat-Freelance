const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Applicant = require("../models/Applicant");

// ── GET PUBLIC PROFILE ───────────────────────────────────────
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, "-password");
    if (!user || !user.isProfilePublic) return res.status(404).json({ error: "Profile not found" });

    let extra = {};
    if (user.role === "freelancer") {
      const apps = await Applicant.find({ email: user.email });
      extra.totalApplications = apps.length;
      extra.hiredCount = apps.filter(a => a.status === "hired").length;
      extra.avgScore = apps.length ? Math.round(apps.reduce((s, a) => s + (a.score || 0), 0) / apps.length) : 0;
    }
    res.json({ ...user.toObject(), ...extra });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── UPDATE PROFILE ───────────────────────────────────────────
router.put("/update/:userId", async (req, res) => {
  try {
    const allowed = ["bio", "skills", "portfolioUrl", "githubUrl", "linkedinUrl", "location", "hourlyRate", "isProfilePublic", "name"];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(req.params.userId, updates, { new: true, select: "-password" });
    res.json({ success: true, user });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;