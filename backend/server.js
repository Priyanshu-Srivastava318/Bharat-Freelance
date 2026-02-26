const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const atsRoutes = require("./routes/ats");
const paymentRoutes = require("./routes/payment");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://bharat-freelance.vercel.app",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/pay", paymentRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "✅ Bharat Freelance API running", timestamp: new Date() });
});

// Default
app.get("/", (req, res) => {
  res.json({ msg: "Bharat Freelance API - Backend Running 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔥 Backend live on http://localhost:${PORT}`)
);
