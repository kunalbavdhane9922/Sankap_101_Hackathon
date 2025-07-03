// Instagram API handler (mockup)
module.exports = (req, res) => {
  // In a real implementation, use access tokens and fetch from Instagram Graph API
  // For now, return mock data
  res.json({
    name: 'mock_instagram_user',
    followers: '10,000',
    avatar: 'https://i.pravatar.cc/40?img=11',
    platform: 'Instagram',
    platformIcon: 'https://img.icons8.com/color/24/instagram-new.png',
    status: 'Active',
  });
}; 