const mongoose = require('../db');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  preferences: {
    niche: { type: String, default: '' },
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: 'light' },
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User; 