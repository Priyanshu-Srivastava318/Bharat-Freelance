const express = require("express");
const Job = require("../models/Job");
const router = express.Router();

// ✅ CREATE JOB
router.post("/create", async (req, res) => {
  try {
    const newJob = new Job(req.body);
    await newJob.save();
    res.json({ 
      success: true,
      msg: "Job created successfully!",
      job: newJob 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Error creating job: " + err.message 
    });
  }
});

// ✅ GET ALL JOBS (Frontend dashboard-freelancer uses this)
// FIXED: Changed from "/all" to "/" to match frontend call
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Error: " + err.message });
  }
});

// ✅ GET EMPLOYER'S OWN JOBS
// FIXED: Changed route to match frontend call pattern
router.get("/:employerId", async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.params.employerId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Error: " + err.message });
  }
});

// ✅ GET SINGLE JOB BY ID
// IMPORTANT: This must come AFTER specific routes like "/create"
// But since we now use /:employerId above, we need to differentiate
// Solution: Use query params or specific route prefix
router.get("/job/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ msg: "Error: " + err.message });
  }
});

// ✅ UPDATE JOB
router.put("/update/:id", async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ 
      success: true,
      msg: "Job updated!",
      job: updatedJob 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Error: " + err.message 
    });
  }
});

// ✅ DELETE JOB
router.delete("/delete/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true,
      msg: "Job deleted!" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Error: " + err.message 
    });
  }
});

module.exports = router;