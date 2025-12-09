// backend/routes/coupons.js
const express = require("express");
const router = express.Router();

const Coupon = require("../models/Coupon");
const { requireAuth } = require("../middleware/auth");

// POST /api/coupons  (protected)
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, store, category, code, description, expiryDate } = req.body;

    if (!title || !store || !code || !expiryDate) {
      return res.status(400).json({ message: "Title, store, code, expiryDate required" });
    }

    const coupon = await Coupon.create({
      title,
      store,
      category: category || "General",
      code,
      description,
      expiryDate: new Date(expiryDate),
      createdBy: req.user.id,
      verified: false
    });

    return res.status(201).json({
      message: "Coupon created",
      coupon
    });

  } catch (err) {
    console.error("🔥 COUPON CREATION ERROR:", err.name, err.message, err);
    res.status(500).json({
      message: "Server error creating coupon",
      error: err.message
    });
  }
});

module.exports = router;
