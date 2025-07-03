const mongoose = require('../db');

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, required: true },
  name: { type: String, required: true },
  followers: { type: Number, default: 0 },
  avatar: { type: String },
  platformIcon: { type: String },
  status: { type: String, default: 'Active' },
  // Add more fields as needed
});

const Account = mongoose.model('Account', accountSchema);
module.exports = Account; 