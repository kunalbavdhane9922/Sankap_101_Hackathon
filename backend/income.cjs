// Mock Income Analytics API
// Output: { totalIncome, monthly, trend, suggestions }

module.exports = (req, res) => {
  res.json({
    totalIncome: 12380.00,
    monthly: [1200, 1400, 1300, 1500, 1600, 1700, 1800, 1880],
    trend: 'up',
    suggestions: [
      'Post more video content for higher engagement.',
      'Try sponsored posts on weekends.',
      'Engage with your audience in comments.'
    ]
  });
}; 