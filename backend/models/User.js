const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["freelancer", "employer", "admin"], required: true },
    // Freelancer profile fields
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    portfolioUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    linkedinUrl: { type: String, default: "" },
    location: { type: String, default: "" },
    hourlyRate: { type: Number, default: 0 },
    isProfilePublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);