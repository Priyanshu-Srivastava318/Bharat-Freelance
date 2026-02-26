const express = require("express");
const multer = require("multer");
const router = express.Router();
const nodemailer = require("nodemailer");

const Job = require("../models/Job");
const Applicant = require("../models/Applicant");
const AtsResult = require("../models/AtsResult");

const upload = multer({ storage: multer.memoryStorage() });

// ── EMAIL HELPER ──────────────────────────────────────────────
const sendMail = async ({ to, subject, html }) => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.log("📧 Email skipped (no GMAIL_USER/GMAIL_PASS in .env)");
    return;
  }
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });
    await transporter.sendMail({ from: `"BharatFreelance" <${process.env.GMAIL_USER}>`, to, subject, html });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("📧 Email error:", err.message);
  }
};

// ── GET APPLICANTS FOR A JOB (employer) ──────────────────────
router.get("/applicants/:jobId", async (req, res) => {
  try {
    const applicants = await Applicant.find({ jobId: req.params.jobId })
      .sort({ score: -1, appliedAt: -1 });
    res.json(applicants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── UPDATE APPLICANT STATUS + EMAIL NOTIFICATION ─────────────
router.put("/applicants/:id/status", async (req, res) => {
  try {
    const applicant = await Applicant.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, reviewedAt: new Date() },
      { new: true }
    ).populate("jobId", "title company");

    // Send email based on status
    const statusEmails = {
      shortlisted: {
        subject: `🌟 You've been shortlisted! — ${applicant.jobId?.title || "Job"}`,
        html: `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
          <h2 style="color:#FF9933">⭐ Congratulations, ${applicant.name}!</h2>
          <p>You've been <strong>shortlisted</strong> for the role of <strong>${applicant.jobId?.title}</strong>.</p>
          <p>The employer will reach out to you soon with next steps.</p>
          <p style="color:#888;font-size:13px">Keep checking your BharatFreelance dashboard for updates.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="color:#bbb;font-size:12px">BharatFreelance — India's Freelancing Platform 🇮🇳</p>
        </div>`,
      },
      hired: {
        subject: `🎉 You're HIRED! — ${applicant.jobId?.title || "Job"}`,
        html: `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
          <h2 style="color:#1dbf73">🎉 You're Hired, ${applicant.name}!</h2>
          <p>Amazing news! You've been <strong>hired</strong> for <strong>${applicant.jobId?.title}</strong>.</p>
          <p>The employer will contact you shortly to discuss project details and payment.</p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin:16px 0">
            <p style="margin:0;color:#166534;font-weight:600">💰 Payment will be processed via Razorpay securely.</p>
          </div>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="color:#bbb;font-size:12px">BharatFreelance — India's Freelancing Platform 🇮🇳</p>
        </div>`,
      },
      rejected: {
        subject: `Application Update — ${applicant.jobId?.title || "Job"}`,
        html: `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
          <h2 style="color:#1a1a1a">Application Update</h2>
          <p>Hi ${applicant.name}, thank you for applying to <strong>${applicant.jobId?.title}</strong>.</p>
          <p>After careful review, the employer has decided to move forward with other candidates at this time.</p>
          <p>Don't be discouraged — there are many more opportunities waiting for you!</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/freelancer" 
            style="display:inline-block;background:linear-gradient(90deg,#FF9933,#1dbf73);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:12px">
            Browse More Jobs →
          </a>
          <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
          <p style="color:#bbb;font-size:12px">BharatFreelance — India's Freelancing Platform 🇮🇳</p>
        </div>`,
      },
    };

    if (statusEmails[req.body.status]) {
      await sendMail({ to: applicant.email, ...statusEmails[req.body.status] });
    }

    res.json({ success: true, applicant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE / WITHDRAW APPLICATION ────────────────────────────
router.delete("/withdraw/:id", async (req, res) => {
  try {
    const { email } = req.body;
    const applicant = await Applicant.findById(req.params.id);
    if (!applicant) return res.status(404).json({ error: "Application not found" });
    if (applicant.email !== email) return res.status(403).json({ error: "Not authorized" });
    if (applicant.status === "hired") return res.status(400).json({ error: "Cannot withdraw — you are already hired!" });

    // Decrement job applicant count
    await Job.findByIdAndUpdate(applicant.jobId, { $inc: { applicants: -1 } });
    await AtsResult.deleteOne({ applicantId: applicant._id });
    await Applicant.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET FREELANCER'S OWN APPLICATIONS ────────────────────────
router.get("/my-applications/:email", async (req, res) => {
  try {
    const email = decodeURIComponent(req.params.email);
    const applications = await Applicant.find({ email })
      .sort({ appliedAt: -1 })
      .populate("jobId", "title company budget category status");
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── ANALYZE RESUME + SAVE APPLICATION + EMAIL EMPLOYER ───────
router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No resume uploaded" });

    const resumeText = req.file.buffer.toString("utf8").toLowerCase();
    const { jobId, name, email, phone, coverLetter = "" } = req.body;

    if (!name || !email || !phone)
      return res.status(400).json({ error: "Name, email and phone are required" });

    const existingApp = await Applicant.findOne({ email, jobId });
    if (existingApp) return res.status(400).json({ error: "You have already applied for this job!" });

    let keywords = [], jobTitle = "the position", job = null;
    if (jobId) {
      try {
        job = await Job.findById(jobId).populate("employerId", "email name");
        if (job) {
          jobTitle = job.title;
          keywords = [
            ...job.title.toLowerCase().split(" "),
            ...(job.skills || []).map((s) => s.toLowerCase()),
            ...(job.description || "").toLowerCase().split(" ").filter((w) => w.length > 4),
          ];
        }
      } catch (err) { console.log("Job not found"); }
    }

    // ATS Scoring
    let score = 50;
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount > 200) score += 10;
    else if (wordCount > 100) score += 5;

    let matchedKeywords = [];
    if (keywords.length > 0) {
      const unique = [...new Set(keywords)].slice(0, 10);
      unique.forEach((k) => { if (resumeText.includes(k)) matchedKeywords.push(k); });
      score += Math.floor((matchedKeywords.length / unique.length) * 30);
    } else {
      ["experience","skill","project","work","team"].forEach((k) => {
        if (resumeText.includes(k)) { score += 6; matchedKeywords.push(k); }
      });
    }
    ["education","experience","skills","projects"].forEach((s) => {
      if (resumeText.includes(s)) score += 2.5;
    });
    score = Math.min(Math.floor(score), 100);

    let feedback = "", suggestions = [];
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

    const applicant = new Applicant({
      name, email, phone, jobId,
      resumeText: resumeText.substring(0, 1000),
      coverLetter, score, appliedAt: new Date(),
    });
    await applicant.save();

    await new AtsResult({ applicantId: applicant._id, jobId, score, feedback, suggestions, matchedKeywords, analyzedAt: new Date() }).save();

    if (job) {
      job.applicants = (job.applicants || 0) + 1;
      await job.save();

      // Email employer about new application
      if (job.employerId?.email) {
        await sendMail({
          to: job.employerId.email,
          subject: `📩 New Application for "${job.title}"`,
          html: `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px">
            <h2 style="color:#1dbf73">New Application Received!</h2>
            <p><strong>${name}</strong> has applied for your job <strong>"${job.title}"</strong>.</p>
            <table style="border-collapse:collapse;width:100%;margin:16px 0">
              <tr><td style="padding:8px;color:#888">ATS Score</td><td style="padding:8px;font-weight:700;color:${score>=70?'#1dbf73':score>=50?'#FF9933':'#ef4444'}">${score}/100</td></tr>
              <tr style="background:#f9f9f9"><td style="padding:8px;color:#888">Email</td><td style="padding:8px">${email}</td></tr>
              <tr><td style="padding:8px;color:#888">Phone</td><td style="padding:8px">${phone}</td></tr>
            </table>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/employer"
              style="display:inline-block;background:linear-gradient(90deg,#FF9933,#1dbf73);color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
              View Applicants →
            </a>
            <hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>
            <p style="color:#bbb;font-size:12px">BharatFreelance 🇮🇳</p>
          </div>`,
        });
      }
    }

    res.json({ success: true, score, feedback, suggestions, matchedKeywords, applicantId: applicant._id });
  } catch (err) {
    console.error("ATS Error:", err);
    res.status(500).json({ success: false, error: "Error analyzing resume", message: err.message });
  }
});

module.exports = router;