const express = require("express");
const router = express.Router();

// ✅ Razorpay integration
// Only load razorpay if keys are present
let Razorpay;
let razorpay;

try {
  Razorpay = require("razorpay");
  if (process.env.RAZORPAY_KEY && process.env.RAZORPAY_SECRET && 
      !process.env.RAZORPAY_KEY.includes('your_key')) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    console.log("✅ Razorpay initialized");
  } else {
    console.log("⚠️ Razorpay keys not configured - payment will be in demo mode");
  }
} catch (e) {
  console.log("⚠️ Razorpay not available");
}

// Create Order (Employer pays freelancer)
router.post("/create-order", async (req, res) => {
  if (!razorpay) {
    return res.json({ 
      success: true,
      demo: true,
      msg: "Payment in demo mode - configure Razorpay keys to enable",
      orderId: "demo_order_" + Date.now(),
      amount: req.body.amount,
      currency: "INR"
    });
  }

  try {
    const { amount, jobId, freelancerId, notes } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `job_${jobId}_${Date.now()}`,
      notes: {
        jobId,
        freelancerId,
        ...notes,
      },
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order, key: process.env.RAZORPAY_KEY });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// Verify Payment
router.post("/verify", async (req, res) => {
  const crypto = require("crypto");
  
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET || "")
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    res.json({ success: true, msg: "Payment verified successfully!" });
  } else {
    res.status(400).json({ success: false, msg: "Payment verification failed" });
  }
});

module.exports = router;
