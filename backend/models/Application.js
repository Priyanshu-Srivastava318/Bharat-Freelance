const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  freelancerId: { type: String, required: true },
  jobId: { type: String, required: true },
  proposal: { type: String, required: true },
  matchScore: { type: Number },
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Application", ApplicationSchema);
