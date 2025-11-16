const mongoose = require("mongoose");

const ApplicantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },
  resumeText: {
    type: String,
    required: true
  },
  resumePath: {
    type: String
  },
  coverLetter: {
    type: String,
    default: ""
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
ApplicantSchema.index({ email: 1, jobId: 1 });

module.exports = mongoose.model("Applicant", ApplicantSchema);