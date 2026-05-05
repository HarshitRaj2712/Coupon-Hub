const express = require("express");
const router = express.Router();
const Coupon = require("../models/Coupon");
const { requireAuth } = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");


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
    const { search, page = 1, limit = 20 } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(parseInt(limit, 10) || 20, 100); // cap at 100

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

    const total = await Coupon.countDocuments(query);

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("createdBy", "name email")
      .lean();

    const totalPages = Math.ceil(total / limitNum);

    res.json({ coupons, total, page: pageNum, totalPages });
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

    await Coupon.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });


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
    $inc: { savesCount: 1 },
  });
  res.json({ saved: true });
});

router.delete("/:id/save", requireAuth, async (req, res) => {
  await Coupon.findByIdAndUpdate(req.params.id, {
    $pull: { savedBy: req.user.id },
    $inc: { savesCount: -1 },
  });
  res.json({ saved: false });
});



// ============================
// ADMIN DELETE ANY COUPON
// DELETE /api/coupons/admin/:id
// ============================
router.delete(
  "/admin/:id",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const deleted = await Coupon.findByIdAndDelete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      res.json({ message: "Coupon deleted by admin" });
    } catch (err) {
      res.status(500).json({ message: "Admin delete failed" });
    }
  }
);

// ============================
// ADMIN: GET ALL COUPONS
// GET /api/coupons/admin/all
// ============================
router.get(
  "/admin/all",
  requireAuth,
  requireAdmin,
  async (req, res) => {
    try {
      const coupons = await Coupon.find()
        .sort({ createdAt: -1 })
        .populate("createdBy", "name email");

      res.json({ coupons });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch all coupons" });
    }
  }
);

// ============================
// ADMIN: GET ALL COUPONS
// GET /api/coupons/admin/all
// ============================
router.get("/admin/all", requireAuth, async (req, res) => {
  try {
    // 🔒 Admin check
    if (!req.user.roles?.includes("admin")) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const coupons = await Coupon.find({})
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    res.json({ coupons });
  } catch (err) {
    console.error("Admin fetch all coupons error:", err);
    res.status(500).json({ message: "Failed to fetch coupons" });
  }
});



module.exports = router;
