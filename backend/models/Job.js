const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    category: { type: String },
    skills: { type: [String], default: [] },
    duration: { type: String },
    company: { type: String },
    employerId: { type: String, required: true },
    employerName: { type: String },
    status: { type: String, enum: ["active", "closed"], default: "active" },
    applicants: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
