const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const atsRoutes = require("./routes/ats");
const paymentRoutes = require("./routes/payment");
const adminRoutes = require("./routes/admin");
const profileRoutes = require("./routes/profile");

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
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "✅ Bharat Freelance API running", timestamp: new Date() });
});

// Default
app.get("/", (req, res) => {
  res.json({ msg: "Bharat Freelance API - Backend Running 🚀" });
});

// ── Render keep-alive: ping self every 14 min to prevent cold starts ──────────
// Render free tier sleeps after 15 min of inactivity — this keeps it warm
const SELF_URL =
  process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 5000}`;

function startKeepAlive() {
  setInterval(async () => {
    try {
      const res = await fetch(`${SELF_URL}/api/health`);
      const data = await res.json();
      console.log(`🏓 Keep-alive ping OK [${new Date().toLocaleTimeString("en-IN")}] →`, data.status);
    } catch (err) {
      console.warn("⚠️  Keep-alive ping failed:", err.message);
    }
  }, 14 * 60 * 1000); // every 14 minutes
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Backend live on http://localhost:${PORT}`);
  startKeepAlive(); // 🏓 start the keep-alive loop
});