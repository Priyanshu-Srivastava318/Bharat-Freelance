const express = require("express");
const Job = require("../models/Job");
const router = express.Router();

// ✅ GET ALL JOBS
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "active" }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Error: " + err.message });
  }
});

// ✅ CREATE JOB
router.post("/create", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.json({ success: true, msg: "Job created successfully!", job: newJob });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error creating job: " + err.message });
  }
});

// ✅ GET SINGLE JOB BY ID - MUST come before /:employerId
router.get("/job/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ msg: "Error: " + err.message });
  }
});

// ✅ GET EMPLOYER'S OWN JOBS
router.get("/employer/:employerId", async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.params.employerId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Error: " + err.message });
  }
});

// ✅ UPDATE JOB
router.put("/update/:id", async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, msg: "Job updated!", job: updatedJob });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error: " + err.message });
  }
});

// ✅ DELETE JOB
router.delete("/delete/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: "Job deleted!" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error: " + err.message });
  }
});

module.exports = router;
