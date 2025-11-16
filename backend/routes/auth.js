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
    res.json({ msg: "Signup Success" });
  } catch (err) {
    res.status(500).json({ msg: "Error: " + err.message });
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

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ msg: "Logged in successfully", token, user });
  } catch (err) {
    res.status(500).json({ msg: "Error: " + err.message });
  }
});

module.exports = router;
