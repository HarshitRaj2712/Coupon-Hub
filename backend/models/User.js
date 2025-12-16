const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: '' },
  email: { type: String, required: true,unique: true , lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ['user'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CA-2User', UserSchema);
