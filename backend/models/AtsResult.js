const mongoose = require("mongoose");

const AtsResultSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Applicant",
    required: true,
    index: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
    index: true
  },
  score: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100
  },
  feedback: {
    type: String,
    required: true
  },
  suggestions: {
    type: [String],
    default: []
  },
  matchedKeywords: {
    type: [String],
    default: []
  },
  missingKeywords: {
    type: [String],
    default: []
  },
  resumeScore: {
    type: Number
  },
  analyzedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Compound index for queries
AtsResultSchema.index({ jobId: 1, score: -1 });
AtsResultSchema.index({ applicantId: 1, jobId: 1 });

module.exports = mongoose.model("AtsResult", AtsResultSchema);