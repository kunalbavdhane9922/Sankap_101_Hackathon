const mongoose = require('../db');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  fullName: { type: String, default: '' },
  mobileNumber: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  bio: { type: String, default: '' },
  preferences: {
    niche: { type: String, default: '' },
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: 'light' },
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
module.exports = User; 