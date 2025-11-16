const express = require("express");
const Razorpay = require("razorpay");
const router = require("express").Router();

router.post("/order", async (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET,
  });

  const options = {
    amount: req.body.amount * 100,
    currency: "INR",
  };

  const order = await instance.orders.create(options);
  res.json(order);
});

module.exports = router;

