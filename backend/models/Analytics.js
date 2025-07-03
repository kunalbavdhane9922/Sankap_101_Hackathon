const mongoose = require('../db');

const analyticsSchema = new mongoose.Schema({
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  followers: { type: Number, default: 0 },
  avgViews: { type: Number, default: 0 },
  engagement: { type: Number, default: 0 },
  history: [{ type: Number }], // for bar chart/time series
  // Add more fields as needed
});

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics; 