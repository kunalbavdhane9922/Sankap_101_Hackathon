// Twitter API handler (mockup)
module.exports = (req, res) => {
  // In a real implementation, use access tokens and fetch from Twitter API v2
  // For now, return mock data
  res.json({
    name: 'mock_twitter_user',
    followers: '7,800',
    avatar: 'https://i.pravatar.cc/40?img=14',
    platform: 'X (Twitter)',
    platformIcon: 'https://img.icons8.com/color/24/twitter--v1.png',
    status: 'Active',
  });
}; 