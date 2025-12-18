const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: "" },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ["user"] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
