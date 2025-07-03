import React, { useEffect, useState } from 'react';
import SentimentAnalyzer from './SentimentAnalyzer';
import '../pages/Home.css';
import API_BASE_URL from "../config";

export default function Billing() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${API_BASE_URL}/billing`)
      .then(res => res.json())
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-main">
      <div className="dashboard-section">
        <h2>Billing</h2>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {data && (
          <>
            <div className="dashboard-payments" style={{ marginBottom: 24 }}>
              <h4>Billing History</h4>
              <ul style={{ paddingLeft: 18 }}>
                {data.history.map((h, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>
                    <span style={{ fontWeight: 500 }}>{h.date}:</span> ${h.amount} - {h.desc}
                  </li>
                ))}
              </ul>
            </div>
            <div className="dashboard-payment-card" style={{ background: '#7d4cff', color: '#fff', marginBottom: 24 }}>
              <div className="dashboard-payment-label"><b>Upcoming Payment</b></div>
              <div>{data.upcoming.date}: ${data.upcoming.amount} - {data.upcoming.desc}</div>
            </div>
            <div className="dashboard-section" style={{ marginBottom: 0 }}>
              <b>AI Tips:</b>
              <ul style={{ paddingLeft: 18 }}>
                {data.aiTips.map((tip, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>
                    {tip}
                    <SentimentAnalyzer text={tip} />
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 