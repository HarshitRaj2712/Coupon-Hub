const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");
const { requireAuth } = require("../middleware/auth");

/* ============================
   ADD COUPON
   POST /api/coupons
============================ */
router.post("/", requireAuth, async (req, res) => {
  try {
    const coupon = new Coupon({
      ...req.body,
      createdBy: req.user.id,
    });

    await coupon.save();
    res.status(201).json({ coupon });
  } catch (err) {
    console.error("Add coupon error:", err);
    res.status(500).json({ message: "Failed to add coupon" });
  }
});

/* ============================
   GET ALL PUBLIC COUPONS
   GET /api/coupons
============================ */
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    const query = {
      expiryDate: { $gte: new Date() },
    };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { store: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.json({ coupons });
  } catch {
    res.status(500).json({ message: "Failed to fetch coupons" });
  }
});


/* ============================
   GET SINGLE COUPON (EDIT)
   GET /api/coupons/:id
============================ */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // 🚫 BLOCK ACCESS TO EXPIRED COUPON
    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: "Coupon has expired" });
    }

    res.json({ coupon });
  } catch (err) {
    console.error("Fetch coupon error:", err);
    res.status(500).json({ message: "Failed to fetch coupon" });
  }
});

/* ============================
   UPDATE COUPON
   PUT /api/coupons/:id
============================ */
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    // 🚫 PREVENT EDITING EXPIRED COUPONS
    if (coupon.expiryDate < new Date()) {
      return res
        .status(400)
        .json({ message: "Coupon has expired and cannot be edited" });
    }

    Object.assign(coupon, req.body);
    await coupon.save();

    res.json({ coupon });
  } catch (err) {
    console.error("Update coupon error:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* ============================
   DELETE COUPON
   DELETE /api/coupons/:id
============================ */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Coupon.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.json({ message: "Coupon deleted" });
  } catch (err) {
    console.error("Delete coupon error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

/* ============================
   MY COUPONS
   GET /api/coupons/my/list
============================ */
router.get("/my/list", requireAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find({
      createdBy: req.user.id,
      expiryDate: { $gte: new Date() },
    }).sort({ createdAt: -1 });

    res.json({ coupons });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch my coupons" });
  }
});

/* ============================
   SAVED COUPONS
   GET /api/coupons/saved/list
============================ */
router.get("/saved/list", requireAuth, async (req, res) => {
  try {
    const coupons = await Coupon.find({
      savedBy: req.user.id,
      expiryDate: { $gte: new Date() },
    });

    res.json({ coupons });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved coupons" });
  }
});

/* ============================
   SAVE / UNSAVE COUPON
============================ */
router.post("/:id/save", requireAuth, async (req, res) => {
  await Coupon.findByIdAndUpdate(req.params.id, {
    $addToSet: { savedBy: req.user.id },
  });
  res.json({ saved: true });
});

router.delete("/:id/save", requireAuth, async (req, res) => {
  await Coupon.findByIdAndUpdate(req.params.id, {
    $pull: { savedBy: req.user.id },
  });
  res.json({ saved: false });
});

module.exports = router;
