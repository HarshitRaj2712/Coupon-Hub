// backend/models/Coupon.js
const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    store: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
    },

    discountType: {
      type: String,
      enum: ["percent", "flat", "free-shipping"],
      default: "flat",
    },

    discountValue: {
      type: Number,
      default: 0,
    },

    sourceUrl: {
      type: String,
      default: "",
    },

    expiryDate: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // 🔥 AUTO DELETE
  },


    verified: {
      type: Boolean,
      default: false,
    },

    /** 🔐 OWNER (for "My Coupons") */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /** ⭐ USERS WHO SAVED THIS COUPON */
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
