// Mock Analytics API
// Output: { instagram: {...}, facebook: {...}, youtube: {...}, twitter: {...} }

const defaultAnalytics = {
  instagram: {
    followers: 0,
    avgViews: 0,
    engagement: 0
  },
  facebook: {
    followers: 0,
    avgViews: 0,
    engagement: 0
  },
  youtube: {
    followers: 0,
    avgViews: 0,
    engagement: 0
  },
  twitter: {
    followers: 0,
    avgViews: 0,
    engagement: 0
  }
};

const mockStats = {
  instagram: { followers: 12400, avgViews: 3200, engagement: 5.2 },
  facebook: { followers: 8500, avgViews: 2100, engagement: 3.8 },
  youtube: { followers: 15200, avgViews: 5400, engagement: 6.1 },
  twitter: { followers: 7800, avgViews: 1800, engagement: 2.9 }
};

module.exports = (req, res) => {
  let accounts = req.query.accounts || req.body?.accounts;
  if (typeof accounts === 'string') {
    try { accounts = JSON.parse(accounts); } catch {}
  }
  if (!Array.isArray(accounts) || accounts.length === 0) {
    return res.json({});
  }
  // Only return analytics for connected accounts
  const result = {};
  accounts.forEach(acc => {
    if (mockStats[acc]) result[acc] = mockStats[acc];
    else result[acc] = defaultAnalytics[acc] || { followers: 0, avgViews: 0, engagement: 0 };
  });
  res.json(result);
}; 