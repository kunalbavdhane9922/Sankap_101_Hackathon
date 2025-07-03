import React, { useEffect, useState } from 'react';
import SentimentAnalyzer from './SentimentAnalyzer';
import BestTimeRecommender from './BestTimeRecommender';
import './Income.css';

export default function Income() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('http://localhost:5000/income')
      .then(res => res.json())
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="income-container">
        <div className="income-loading">Loading income data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="income-container">
        <div className="income-error">{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="income-container">
        <div className="income-error">No income data available</div>
      </div>
    );
  }

  // Calculate max value for chart scaling
  const maxValue = Math.max(...data.monthly);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="income-container">
      <div className="income-header">
        <h1 className="income-title">Income Analytics</h1>
        <p className="income-subtitle">Track your earnings and growth trends</p>
      </div>

      <div className="income-total">
        <div className="income-total-label">Total Income</div>
        <div className="income-total-amount">${data.totalIncome.toLocaleString()}</div>
        <div className="income-total-period">This Year</div>
      </div>

      <div className="income-chart-section">
        <h2 className="income-chart-title">Monthly Income Breakdown</h2>
        <div className="income-chart-container">
          <div className="income-chart-bars">
            {data.monthly.map((value, index) => (
              <div
                key={index}
                className="income-chart-bar"
                style={{ height: `${(value / maxValue) * 100}%` }}
              >
                <span className="income-chart-value">${value}</span>
              </div>
            ))}
          </div>
          <div className="income-chart-labels">
            {monthNames.slice(0, data.monthly.length).map((month, index) => (
              <span key={index}>{month}</span>
            ))}
          </div>
        </div>

        <div className={`income-trend ${data.trend}`}>
          <span className="income-trend-icon">
            {data.trend === 'up' ? '↗' : '↘'}
          </span>
          <span>
            Trend: {data.trend === 'up' ? 'Increasing' : 'Decreasing'}
          </span>
        </div>
      </div>

      <div className="income-suggestions">
        <h2 className="income-suggestions-title">AI-Powered Suggestions</h2>
        <ul className="income-suggestions-list">
          {data.suggestions.map((suggestion, index) => (
            <li key={index} className="income-suggestion-item">
              <p className="income-suggestion-text">{suggestion}</p>
              <div className="income-suggestion-tools">
                <SentimentAnalyzer text={suggestion} />
                <BestTimeRecommender platform="instagram" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 