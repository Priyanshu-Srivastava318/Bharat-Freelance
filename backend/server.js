const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const atsRoutes = require("./routes/ats");
const paymentRoutes = require("./routes/payment");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// =============================
//  SERVE PUBLIC FRONTEND FILES
// =============================
app.use(express.static(path.join(__dirname, "../public")));

// Default route → automatically serve index / home  
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/about.html"));
});

// =============================
//        API ROUTES
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/pay", paymentRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔥 Backend live on http://localhost:${PORT}`)
);
