// Mock Settings API
// Output: { preferences, aiRecommendations }

module.exports = (req, res) => {
  res.json({
    preferences: {
      niche: 'fitness',
      notifications: true,
      theme: 'light',
    },
    aiRecommendations: [
      'Switch to dark mode for better night-time productivity.',
      'Try the travel niche for higher engagement.',
      'Enable notifications to never miss a trend.'
    ]
  });
}; 