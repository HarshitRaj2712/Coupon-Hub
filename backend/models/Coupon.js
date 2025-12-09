// backend/models/Coupon.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    store: { type: String, required: true },
    category: { type: String },
    code: { type: String, required: true },
    description: { type: String },
    expiryDate: { type: Date, required: true },
    verified: { type: Boolean, default: false },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
