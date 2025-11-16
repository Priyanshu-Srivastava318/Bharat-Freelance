const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  description: { 
    type: String, 
    required: true 
  },
  skills: { 
    type: [String], 
    required: true,
    default: []
  },
  budget: { 
    type: Number, 
    required: true,
    min: 0
  },
  employerId: { 
    type: String, 
    required: true,
    index: true  // For faster queries
  },
  
  // Additional useful fields
  category: {
    type: String,
    enum: ['Web Development', 'Graphic Design', 'Content Writing', 'Video Editing', 'Digital Marketing', 'Mobile Apps', 'Data Analysis', 'Voice Over', 'General'],
    default: 'General'
  },
  
  company: {
    type: String,
    default: 'Company Name'
  },
  
  employerName: {
    type: String,
    default: 'Employer'
  },
  
  duration: {
    type: String,
    default: 'Flexible'
  },
  
  status: {
    type: String,
    enum: ['active', 'closed', 'filled'],
    default: 'active'
  },
  
  applicants: {
    type: Number,
    default: 0
  },
  
  location: {
    type: String,
    default: 'Remote'
  },
  
  experienceLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Expert', 'Any'],
    default: 'Any'
  },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true  // Automatically manages createdAt and updatedAt
});

// Index for better search performance
JobSchema.index({ title: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model("Job", JobSchema);