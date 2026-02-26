const express = require("express");
const multer = require("multer");
const router = express.Router();

const Job = require("../models/Job");
const Applicant = require("../models/Applicant");
const AtsResult = require("../models/AtsResult");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/test", (req, res) => {
  res.json({ status: "ATS route working" });
});

// ✅ GET APPLICANTS FOR A JOB (for employer dashboard)
router.get("/applicants/:jobId", async (req, res) => {
  try {
    const applicants = await Applicant.find({ jobId: req.params.jobId })
      .sort({ score: -1, appliedAt: -1 });
    res.json(applicants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE APPLICANT STATUS
router.put("/applicants/:id/status", async (req, res) => {
  try {
    const applicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, reviewedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, applicant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ MAIN: Analyze Resume + Save Application
router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume uploaded" });
    }

    const resumeText = req.file.buffer.toString("utf8").toLowerCase();
    const { jobId, name, email, phone, coverLetter = "" } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Name, email and phone are required" });
    }

    // Check for duplicate application
    const existingApp = await Applicant.findOne({ email, jobId });
    if (existingApp) {
      return res.status(400).json({ 
        error: "You have already applied for this job!" 
      });
    }

    // Get job for keyword matching
    let keywords = [];
    let jobTitle = "the position";
    let job = null;

    if (jobId) {
      try {
        job = await Job.findById(jobId);
        if (job) {
          jobTitle = job.title;
          keywords = [
            ...job.title.toLowerCase().split(" "),
            ...(job.skills || []).map((s) => s.toLowerCase()),
            ...(job.description || "")
              .toLowerCase()
              .split(" ")
              .filter((w) => w.length > 4),
          ];
        }
      } catch (err) {
        console.log("Job not found, using basic scoring");
      }
    }

    // Calculate ATS Score
    let score = 50;

    // 1. Resume Length (10 pts)
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount > 200) score += 10;
    else if (wordCount > 100) score += 5;

    // 2. Keyword Matching (30 pts)
    let matchedKeywords = [];
    if (keywords.length > 0) {
      const uniqueKeywords = [...new Set(keywords)].slice(0, 10);
      uniqueKeywords.forEach((keyword) => {
        if (resumeText.includes(keyword)) matchedKeywords.push(keyword);
      });
      score += Math.floor((matchedKeywords.length / uniqueKeywords.length) * 30);
    } else {
      const defaultKeywords = ["experience", "skill", "project", "work", "team"];
      defaultKeywords.forEach((k) => {
        if (resumeText.includes(k)) { score += 6; matchedKeywords.push(k); }
      });
    }

    // 3. Sections Check (10 pts)
    const sections = ["education", "experience", "skills", "projects"];
    sections.forEach((s) => { if (resumeText.includes(s)) score += 2.5; });

    score = Math.min(Math.floor(score), 100);

    // Generate feedback
    let feedback = "";
    let suggestions = [];

    if (score >= 85) {
      feedback = `🔥 Excellent Match! Your resume is highly compatible with ${jobTitle}.`;
      suggestions = ["Your profile is strong! Consider applying to similar positions.", "Highlight specific achievements in your cover letter."];
    } else if (score >= 70) {
      feedback = `✅ Good Match! Your resume aligns well with ${jobTitle}.`;
      suggestions = ["Consider adding more specific examples of your work.", "Quantify your achievements with numbers and metrics."];
    } else if (score >= 55) {
      feedback = `🟡 Moderate Match. Some improvements needed for ${jobTitle}.`;
      suggestions = ["Add more relevant keywords from the job description.", "Expand on your relevant skills and experience.", "Include any relevant certifications or training."];
    } else {
      feedback = `🔴 Low Match. Significant improvements needed for ${jobTitle}.`;
      suggestions = ["Tailor your resume to include job-specific keywords.", "Add relevant projects and experience.", "Consider taking courses to build required skills.", "Ensure your resume covers: Education, Experience, Skills, Projects."];
    }

    // Save to DB
    const applicant = new Applicant({
      name, email, phone, jobId,
      resumeText: resumeText.substring(0, 1000),
      coverLetter,
      score,
      appliedAt: new Date(),
    });
    await applicant.save();

    const atsResult = new AtsResult({
      applicantId: applicant._id,
      jobId,
      score,
      feedback,
      suggestions,
      matchedKeywords,
      analyzedAt: new Date(),
    });
    await atsResult.save();

    // Update job applicant count
    if (job) {
      job.applicants = (job.applicants || 0) + 1;
      await job.save();
    }

    console.log(`📊 ATS: Score ${score} | Job: ${jobId} | Applicant: ${email}`);

    res.json({
      success: true,
      score,
      feedback,
      suggestions,
      matchedKeywords,
      applicantId: applicant._id,
    });
  } catch (err) {
    console.error("ATS Error:", err);
    res.status(500).json({ success: false, error: "Error analyzing resume", message: err.message });
  }
});

module.exports = router;
