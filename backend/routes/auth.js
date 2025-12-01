const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already exists!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // ✅ FIXED: Generate token and return user data immediately after signup
    // This enables auto-login after signup
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role }, 
      process.env.JWT_SECRET || "fallback_secret_key_12345",
      { expiresIn: "7d" }
    );

    // Return user without password
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };

    res.json({ 
      success: true,
      msg: "Signup Success",
      token,
      user: userResponse
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Error: " + err.message 
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "❌ User not found" });

    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) return res.status(400).json({ msg: "⚠ Wrong password" });

    // ✅ FIXED: Added expiry and fallback secret
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || "fallback_secret_key_12345",
      { expiresIn: "7d" }
    );

    // ✅ FIXED: Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    res.json({ 
      success: true,
      msg: "Logged in successfully", 
      token, 
      user: userResponse 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      msg: "Error: " + err.message 
    });
  }
});

module.exports = router;