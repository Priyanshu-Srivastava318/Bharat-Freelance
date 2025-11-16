const express = require("express");
const multer = require("multer");
const router = express.Router();

const Job = require("../models/Job");
const Applicant = require("../models/Applicant");
const AtsResult = require("../models/AtsResult");

// Store resume in memory
const upload = multer({ storage: multer.memoryStorage() });

router.get("/test", (req, res) => {
  res.json({ status: "ATS route working" });
});

// 🎯 ENHANCED AI Resume Scoring with DB Storage
router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume uploaded" });
    }

    const resumeText = req.file.buffer.toString('utf8').toLowerCase();
    const jobId = req.body.jobId;
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const coverLetter = req.body.coverLetter || "";
    
    // Get job details for keyword matching
    let keywords = [];
    let jobTitle = "the position";
    let job = null;
    
    if (jobId) {
      try {
        job = await Job.findById(jobId);
        if (job) {
          jobTitle = job.title;
          // Extract keywords from job
          keywords = [
            ...job.title.toLowerCase().split(' '),
            ...(job.skills || []).map(s => s.toLowerCase()),
            ...(job.description || '').toLowerCase().split(' ').filter(w => w.length > 4)
          ];
        }
      } catch (err) {
        console.log("Job not found, using basic scoring");
      }
    }

    // Calculate ATS Score based on multiple factors
    let score = 50; // Base score
    
    // 1. Resume Length Check (10 points)
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount > 200) score += 10;
    else if (wordCount > 100) score += 5;
    
    // 2. Keyword Matching (30 points)
    if (keywords.length > 0) {
      const uniqueKeywords = [...new Set(keywords)].slice(0, 10);
      let matchCount = 0;
      
      uniqueKeywords.forEach(keyword => {
        if (resumeText.includes(keyword)) {
          matchCount++;
        }
      });
      
      score += Math.floor((matchCount / uniqueKeywords.length) * 30);
    } else {
      // Default keywords if no job specified
      const defaultKeywords = ['experience', 'skill', 'project', 'work', 'team'];
      let matchCount = 0;
      
      defaultKeywords.forEach(keyword => {
        if (resumeText.includes(keyword)) matchCount++;
      });
      
      score += matchCount * 6;
    }
    
    // 3. Common Important Sections (10 points)
    const sections = ['education', 'experience', 'skills', 'projects'];
    let sectionCount = 0;
    sections.forEach(section => {
      if (resumeText.includes(section)) sectionCount++;
    });
    score += sectionCount * 2.5;

    // Cap score at 100
    score = Math.min(Math.floor(score), 100);

    // Generate feedback based on score
    let feedback = "";
    let suggestions = [];

    if (score >= 85) {
      feedback = `🔥 Excellent Match! Your resume is highly compatible with ${jobTitle}.`;
      suggestions = [
        "Your profile is strong! Consider applying to similar positions.",
        "Highlight specific achievements in your cover letter."
      ];
    } else if (score >= 70) {
      feedback = `✅ Good Match! Your resume aligns well with ${jobTitle}.`;
      suggestions = [
        "Consider adding more specific examples of your work.",
        "Quantify your achievements with numbers and metrics."
      ];
    } else if (score >= 55) {
      feedback = `🟡 Moderate Match. Some improvements needed for ${jobTitle}.`;
      suggestions = [
        "Add more relevant keywords from the job description.",
        "Expand on your relevant skills and experience.",
        "Include any relevant certifications or training."
      ];
    } else {
      feedback = `🔴 Low Match. Significant improvements needed for ${jobTitle}.`;
      suggestions = [
        "Tailor your resume to include job-specific keywords.",
        "Add relevant projects and experience.",
        "Consider taking courses to build required skills.",
        "Ensure your resume covers: Education, Experience, Skills, Projects."
      ];
    }

    // ✅ SAVE APPLICANT TO DATABASE
    try {
      const applicant = new Applicant({
        name: name,
        email: email,
        phone: phone,
        jobId: jobId,
        resumeText: resumeText.substring(0, 1000), // Store first 1000 chars
        coverLetter: coverLetter,
        appliedAt: new Date()
      });
      
      await applicant.save();
      console.log("✅ Applicant saved:", applicant._id);

      // ✅ SAVE ATS RESULT TO DATABASE
      const atsResult = new AtsResult({
        applicantId: applicant._id,
        jobId: jobId,
        score: score,
        feedback: feedback,
        suggestions: suggestions,
        analyzedAt: new Date()
      });
      
      await atsResult.save();
      console.log("✅ ATS Result saved:", atsResult._id);

      // ✅ UPDATE JOB APPLICANTS COUNT
      if (job) {
        job.applicants = (job.applicants || 0) + 1;
        await job.save();
        console.log(`✅ Job applicants updated: ${job.applicants}`);
      }

    } catch (dbError) {
      console.error("❌ Database save error:", dbError);
      // Don't fail the request if DB save fails, still return the score
    }

    // Log application
    console.log(`📊 ATS Analysis - Score: ${score}, Job: ${jobId || 'N/A'}, Applicant: ${email}`);

    res.json({
      success: true,
      score,
      feedback,
      suggestions,
      resumePreview: resumeText.substring(0, 150) + "..."
    });

  } catch (err) {
    console.error("ATS Error:", err);
    res.status(500).json({ 
      success: false,
      error: "Error analyzing resume",
      message: err.message 
    });
  }
});

module.exports = router;