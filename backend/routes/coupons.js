// backend/routes/coupons.js
const express = require("express");
const router = express.Router();

const Coupon = require("../models/Coupon");
const { requireAuth } = require("../middleware/auth");

/**
 * GET /api/coupons
 * Public – fetch active coupons
 */
router.get("/", async (req, res) => {
  try {
    const coupons = await Coupon.find({
      expiryDate: { $gte: new Date() }
    }).sort({ createdAt: -1 });

    res.json({ coupons });
  } catch (err) {
    console.error("🔥 FETCH COUPONS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch coupons" });
  }
});

/**
 * POST /api/coupons
 * Protected – add coupon
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { title, store, category, code, description, expiryDate } = req.body;

    if (!title || !store || !code || !expiryDate) {
      return res.status(400).json({ message: "Missing required fields" });
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

    res.status(201).json({ message: "Coupon created", coupon });

  } catch (err) {
    console.error("🔥 CREATE COUPON ERROR:", err);
    res.status(500).json({ message: "Server error creating coupon" });
  }
});

module.exports = router;
