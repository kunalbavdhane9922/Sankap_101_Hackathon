// Facebook API handler (mockup)
module.exports = (req, res) => {
  // In a real implementation, use access tokens and fetch from Facebook Graph API
  // For now, return mock data
  res.json({
    name: 'mock_facebook_user',
    followers: '8,500',
    avatar: 'https://i.pravatar.cc/40?img=12',
    platform: 'Facebook',
    platformIcon: 'https://img.icons8.com/color/24/facebook-new.png',
    status: 'Active',
  });
}; 