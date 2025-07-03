// Mock Billing API
// Output: { history, upcoming, aiTips }

module.exports = (req, res) => {
  res.json({
    history: [
      { date: '2024-01-01', amount: 29.99, desc: 'Pro Plan Subscription' },
      { date: '2024-02-01', amount: 29.99, desc: 'Pro Plan Subscription' },
      { date: '2024-03-01', amount: 29.99, desc: 'Pro Plan Subscription' },
    ],
    upcoming: { date: '2024-04-01', amount: 29.99, desc: 'Pro Plan Subscription' },
    aiTips: [
      'Consider switching to annual billing for a discount.',
      'Set up auto-pay to avoid missed payments.'
    ]
  });
}; 