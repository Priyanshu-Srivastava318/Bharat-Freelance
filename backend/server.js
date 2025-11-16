const express = require("express");
const cors = require("cors");
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

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/pay", paymentRoutes);
app.use("/api/ats", require("./routes/ats"));


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔥 Backend live on http://localhost:${PORT}`)
);
