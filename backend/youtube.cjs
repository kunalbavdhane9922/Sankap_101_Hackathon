// YouTube API handler (mockup)
module.exports = (req, res) => {
  // In a real implementation, use access tokens and fetch from YouTube Data API
  // For now, return mock data
  res.json({
    name: 'mock_youtube_user',
    followers: '15,200',
    avatar: 'https://i.pravatar.cc/40?img=13',
    platform: 'YouTube',
    platformIcon: 'https://img.icons8.com/color/24/youtube-play.png',
    status: 'Active',
  });
};