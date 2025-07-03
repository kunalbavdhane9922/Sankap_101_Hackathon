import React, { useEffect, useState } from 'react';
import './Home.css';
import CompetitorComparison from "../components/CompetitorComparison";

const platformColors = {
  Instagram: '#E1306C',
  Facebook: '#1877F3',
  YouTube: '#FF0000',
  'X (Twitter)': '#1DA1F2',
  Twitter: '#1DA1F2',
};

function CircularProgress({ percent, color, label, value, total }) {
  const radius = 28;
  const stroke = 6;
  const norm = 2 * Math.PI * radius;
  const offset = norm - (percent / 100) * norm;
  return (
    <div className="circular-progress">
      <svg width="64" height="64">
        <circle cx="32" cy="32" r={radius} stroke="#eee" strokeWidth={stroke} fill="none" />
        <circle cx="32" cy="32" r={radius} stroke={color} strokeWidth={stroke} fill="none" strokeDasharray={norm} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.5s' }} />
      </svg>
      <div className="circular-progress-label">
        <div style={{ fontWeight: 700, fontSize: 18 }}>{value}/{total}</div>
        <div style={{ fontSize: 12 }}>{label}</div>
      </div>
    </div>
  );
}

function AnalyticsCard({ account, analytics }) {
  return (
    <div className="analytics-card" style={{ borderColor: platformColors[account.platform] || '#ccc' }}>
      <div className="analytics-card-header">
        <img src={account.avatar} alt={account.name} className="analytics-avatar" />
        <div>
          <div className="analytics-name">{account.name}</div>
          <div className="analytics-platform" style={{ color: platformColors[account.platform] || '#888' }}>
            <img src={account.platformIcon} alt={account.platform} className="analytics-platform-icon" />
            {account.platform}
          </div>
        </div>
      </div>
      <div className="analytics-followers">
        <span className="analytics-followers-count">{analytics?.followers?.toLocaleString() ?? 0}</span>
        <span className="analytics-followers-label">Followers</span>
        <div style={{ fontSize: '0.95rem', color: '#888', marginTop: 4 }}>Avg Views: {analytics?.avgViews?.toLocaleString() ?? 0}</div>
        <div style={{ fontSize: '0.95rem', color: '#888' }}>Engagement: {analytics?.engagement ?? 0}%</div>
      </div>
    </div>
  );
}

const Home = () => {
  const [accounts, setAccounts] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch accounts and analytics from backend
  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const accRes = await fetch('http://localhost:5000/api/accounts');
      const accData = await accRes.json();
      setAccounts(Array.isArray(accData) ? accData : []);
      const anRes = await fetch('http://localhost:5000/api/analytics');
      const anData = await anRes.json();
      // Map analytics by account id
      const analyticsMap = {};
      (Array.isArray(anData) ? anData : []).forEach(a => { analyticsMap[a.account] = a; });
      setAnalytics(analyticsMap);
    } catch (err) {
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Example: dynamic bar chart for Instagram if connected
  const instagramAccount = accounts.find(acc => acc.platform?.toLowerCase?.() === 'instagram');
  const instagramAnalytics = instagramAccount ? analytics[instagramAccount._id] : null;
  const barChartData = instagramAnalytics?.history?.length
    ? instagramAnalytics.history
    : [50, 60, 55, 80, 65, 70, 60, 75, 60, 70, 65, 80, 60, 70]; // fallback
  const barChartLabels = ['Feb 5', 'Feb 7', 'Feb 9', 'Feb 11', 'Feb 13', 'Feb 15', 'Feb 17', 'Feb 19'];

  // Example: dynamic summary and payments (mock for now, can be made dynamic)
  const summary = [
    { color: '#7d4cff', value: 12, total: 15 },
    { color: '#ff6f4c', value: 12, total: 15 },
    { color: '#00c287', value: 12, total: 15 },
  ];
  const payments = [
    { label: 'Average Income', value: 12380, color: '#7d4cff', percent: 75 },
    { label: 'Average Spend', value: 26200, color: '#22c55e', percent: 25 },
  ];

  return (
    <div className="dashboard-main">
      {/* Top Bar */}
      <div className="dashboard-topbar">
        <div className="dashboard-greeting">
          <img src="https://i.pravatar.cc/48" alt="avatar" className="dashboard-avatar" />
          <span className="dashboard-greeting-text">Good Evening Shakir!</span>
        </div>
        <div className="dashboard-controls">
          <select className="dashboard-select"><option>Choose</option></select>
          <button className="dashboard-icon-btn"><span role="img" aria-label="inbox">📥</span></button>
          <button className="dashboard-icon-btn"><span role="img" aria-label="bell">🔔</span></button>
          <button className="dashboard-icon-btn"><span role="img" aria-label="user">👤</span></button>
        </div>
      </div>
      <div className="dashboard-content-row">
        <div className="dashboard-main-content">
          {/* Bar Chart */}
          {instagramAccount && (
            <div className="dashboard-section">
              <h3 className="dashboard-section-title">Instagram Subscribers</h3>
              <div className="dashboard-barchart">
                {barChartData.map((val, i) => (
                  <div key={i} className="dashboard-bar" style={{ height: val, background: i % 2 === 0 ? '#7d4cff' : '#22c55e' }}></div>
                ))}
              </div>
              <div className="dashboard-barchart-labels">
                {barChartLabels.map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </div>
          )}
          {/* Analytics Cards */}
          <div className="dashboard-cards-row">
            {loading && <div>Loading analytics...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {accounts.length === 0 && !loading && (
              <div className="no-accounts-message">
                No accounts connected. Go to the Users page to add your social accounts!
              </div>
            )}
            {accounts.map((account, idx) => (
              <AnalyticsCard key={account._id || account.platform + idx} account={account} analytics={analytics[account._id]} />
            ))}
          </div>
          {/* Competitor Comparison Feature */}
          <CompetitorComparison niche="fitness" />
        </div>
        <div className="dashboard-right">
          <div className="dashboard-summary">
            <h4>Account Summary</h4>
            {summary.map((s, i) => (
              <CircularProgress key={i} percent={Math.round((s.value/s.total)*100)} color={s.color} label="Video Lectures" value={s.value} total={s.total} />
            ))}
          </div>
          <div className="dashboard-payments">
            <h4>Payments</h4>
            {payments.map((p, i) => (
              <div key={i} className="dashboard-payment-card" style={{ background: p.color }}>
                <div className="dashboard-payment-percent">{p.percent}%</div>
                <div className="dashboard-payment-label">{p.label}</div>
                <div className="dashboard-payment-value">${p.value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 