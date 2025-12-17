const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");
const { requireAuth } = require("../middleware/auth");

/**
 * GET /api/coupons/my
 * Coupons created by logged-in user
 */
router.get("/my", requireAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ coupons });
  } catch (err) {
    console.error("My coupons error:", err);
    res.status(500).json({ message: "Failed to fetch my coupons" });
  }
});

/**
 * GET /api/coupons/saved
 * Coupons saved by logged-in user
 */
router.get("/saved", requireAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find({
      savedBy: req.user.id, // array field
    }).sort({ createdAt: -1 });

    res.json({ coupons });
  } catch (err) {
    console.error("Saved coupons error:", err);
    res.status(500).json({ message: "Failed to fetch saved coupons" });
  }
});

/**
 * GET /api/coupons
 * Public coupons list
 */
router.get("/", async (req, res) => {
  const coupons = await Coupon.find({
    expiryDate: { $gte: new Date() },
  }).sort({ createdAt: -1 });

  res.json({ coupons });
});

module.exports = router;
