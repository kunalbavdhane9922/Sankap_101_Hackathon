const express = require('express');
const router = express.Router();
const User = require('./models/User');
const Account = require('./models/Account');
const Analytics = require('./models/Analytics');

// Dynamic competitor comparison endpoint
router.get('/compareCompetitors', async (req, res) => {
  try {
    const { niche } = req.query;
    // Find a demo user (simulate 'you')
    const user = await User.findOne({ username: 'demo' });
    if (!user) return res.status(404).json({ error: 'Demo user not found' });
    // Find all users in this niche
    const usersInNiche = await User.find({ 'preferences.niche': niche });
    const userIds = usersInNiche.map(u => u._id);
    // Find all accounts for these users
    const accounts = await Account.find({ user: { $in: userIds } });
    const accountIds = accounts.map(a => a._id);
    // Get analytics for these accounts
    const analytics = await Analytics.find({ account: { $in: accountIds } });
    // Map accountId to analytics
    const analyticsMap = {};
    analytics.forEach(a => { analyticsMap[a.account.toString()] = a; });
    // Find 'your' account and analytics (first account for demo user)
    const yourAccount = await Account.findOne({ user: user._id });
    const yourAnalytics = yourAccount ? analyticsMap[yourAccount._id.toString()] : null;
    // Find top competitor (highest followers, not you)
    let topCompetitor = null;
    let maxFollowers = -1;
    accounts.forEach(acc => {
      if (yourAccount && acc._id.equals(yourAccount._id)) return;
      const a = analyticsMap[acc._id.toString()];
      if (a && a.followers > maxFollowers) {
        maxFollowers = a.followers;
        topCompetitor = a;
      }
    });
    // Compute averages
    let sumFollowers = 0, sumEngagement = 0, count = 0;
    analytics.forEach(a => {
      sumFollowers += a.followers;
      sumEngagement += a.engagement;
      count++;
    });
    const avgFollowers = count ? sumFollowers / count : 0;
    const avgEngagement = count ? sumEngagement / count : 0;
    res.json({
      you: yourAnalytics ? { followers: yourAnalytics.followers, engagement: yourAnalytics.engagement } : { followers: 0, engagement: 0 },
      topCompetitor: topCompetitor ? { followers: topCompetitor.followers, engagement: topCompetitor.engagement } : { followers: 0, engagement: 0 },
      average: { followers: Math.round(avgFollowers), engagement: Number(avgEngagement.toFixed(1)) }
    });
  } catch (err) {
    console.error('Error in /compareCompetitors:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 