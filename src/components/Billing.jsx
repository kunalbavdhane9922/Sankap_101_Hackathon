import React, { useEffect, useState } from 'react';
import SentimentAnalyzer from './SentimentAnalyzer';
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
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', background: '#f4f4ff', minHeight: '100vh' }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        padding: '32px'
      }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#333', marginBottom: '24px' }}>Billing</h2>

        {loading && <div style={{ fontSize: '1rem', color: '#666' }}>Loading billing info...</div>}
        {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

        {data && (
          <>
            {/* Billing History */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '12px' }}>Billing History</h4>
              <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                {data.history.map((h, i) => (
                  <li key={i} style={{
                    marginBottom: 12,
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    borderLeft: '4px solid #7d4cff',
                    fontSize: '0.95rem'
                  }}>
                    <span style={{ fontWeight: 600 }}>{h.date}</span>: <span style={{ color: '#16a34a', fontWeight: 600 }}>${h.amount}</span> – {h.desc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Upcoming Payment */}
            <div style={{
              background: 'linear-gradient(90deg, #ede9fe, #f5f3ff)', // Light lavender gradient
  color: '#333',
  padding: '16px 24px',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  marginBottom: 24,
  border: '1px solid #dcd6f7'
}}>
              <div style={{ fontWeight: '600', marginBottom: 6 }}>
    📅 Upcoming Payment
  </div>
  <div>
    <b>{data.upcoming.date}</b>: ${data.upcoming.amount} – {data.upcoming.desc}
  </div>
</div>

            {/* AI Tips */}
            <div style={{ marginBottom: 0 }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '12px' }}>AI Tips</h4>
              <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                {data.aiTips.map((tip, i) => (
                  <li key={i} style={{
                    marginBottom: 12,
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    borderLeft: '4px solid #7d4cff',
                    fontSize: '0.95rem'
                  }}>
                    {tip}
                    <div style={{ marginTop: 6 }}>
                      <SentimentAnalyzer text={tip} />
                    </div>
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
