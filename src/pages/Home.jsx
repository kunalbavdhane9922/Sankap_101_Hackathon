import React, { useEffect, useState, useRef } from 'react';
import './Home.css';
// import CompetitorComparison from "../components/CompetitorComparison";
import API_BASE_URL from "../config";

const platformColors = {
  Instagram: '#E1306C',
  Facebook: '#1877F3',
  YouTube: '#FF0000',
  'X (Twitter)': '#1DA1F2',
  Twitter: '#1DA1F2',
};



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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [starRating, setStarRating] = useState(0);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const feedbackModalRef = useRef(null);

  // Navbar button handlers
  const handleInboxClick = () => {
    alert('Inbox feature coming soon!');
  };
  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);
  };
  const handleUserClick = () => {
    // If using React Router, use navigate('/profile')
    window.location.href = '/profile';
  };

  // Close notification panel when clicking outside
  React.useEffect(() => {
    if (!showNotifications) return;
    const handleClick = (e) => {
      if (!e.target.closest('.notification-panel') && !e.target.closest('.dashboard-icon-btn-bell')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showNotifications]);

  // Get user data from localStorage
  const userEmail = localStorage.getItem("user.email");
  const userFullName = localStorage.getItem("user.fullName") || localStorage.getItem("user.username") || "User";
  const username = localStorage.getItem("user.username") || "User";
  const userProfilePhoto = localStorage.getItem("user.profilePhoto") || "";

  // Fetch accounts and analytics from backend
  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const accRes = await fetch(`${API_BASE_URL}/api/accounts`);
      const accData = await accRes.json();
      setAccounts(Array.isArray(accData) ? accData : []);
      const anRes = await fetch(`${API_BASE_URL}/api/analytics`);
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

  // Example: dynamic payments (mock for now, can be made dynamic)
  const payments = [
    { label: 'Average Income', value: 12380, color: '#7d4cff', percent: 75 },
    { label: 'Average Spend', value: 26200, color: '#22c55e', percent: 25 },
  ];

  return (
    <div className="dashboard-main">
      {/* Top Bar */}
      <div className="dashboard-topbar">
        <div className="dashboard-greeting">
          {userProfilePhoto ? (
            <img src={userProfilePhoto} alt="avatar" className="dashboard-avatar" />
          ) : (
            <div className="dashboard-avatar-placeholder">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="dashboard-greeting-text">Welcome {username}!</span>
        </div>
        <div className="dashboard-controls">
          <button className="dashboard-icon-btn" onClick={() => setShowFeedbackModal(true)}><span role="img" aria-label="star">⭐</span></button>
          <button className="dashboard-icon-btn" onClick={handleInboxClick}><span role="img" aria-label="inbox">📥</span></button>
          <button className="dashboard-icon-btn dashboard-icon-btn-bell" onClick={handleBellClick}><span role="img" aria-label="bell">🔔</span></button>
          <button className="dashboard-icon-btn" onClick={handleUserClick}><span role="img" aria-label="user">👤</span></button>
          {showNotifications && (
            <div className="notification-panel" style={{ position: 'absolute', top: 70, right: 40, width: 320, background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.13)', zIndex: 100, padding: 18 }}>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10, color: '#7d4cff' }}>Notifications</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ padding: '10px 0', borderBottom: '1px solid #eee', color: '#444' }}>No new notifications</li>
                {/* Add more notifications here */}
              </ul>
            </div>
          )}
          {/* Feedback Modal */}
          {showFeedbackModal && (
            <div className="feedback-modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="feedback-modal" ref={feedbackModalRef} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 32px rgba(0,0,0,0.13)', padding: 32, minWidth: 320, maxWidth: '90vw', textAlign: 'center', position: 'relative' }}>
                <button onClick={() => setShowFeedbackModal(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#888' }}>&times;</button>
                <h2 style={{ marginBottom: 16 }}>Rate Us</h2>
                <div style={{ marginBottom: 18 }}>
                  {[1,2,3,4,5].map(star => (
                    <span
                      key={star}
                      style={{
                        fontSize: 32,
                        cursor: 'pointer',
                        color: star <= starRating ? '#FFD700' : '#ccc',
                        transition: 'color 0.2s'
                      }}
                      onClick={() => setStarRating(star)}
                      onMouseOver={() => setStarRating(star)}
                      onMouseLeave={() => setStarRating(starRating)}
                      role="img"
                      aria-label={star + ' star'}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Your feedback..."
                  rows={4}
                  style={{ width: '100%', borderRadius: 8, border: '1px solid #ccc', padding: 10, marginBottom: 18, resize: 'vertical' }}
                />
                <br />
                <button
                  style={{ background: '#7d4cff', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 28px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
                  onClick={async () => {
                    setSubmittingFeedback(true);
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: feedbackText, rating: starRating })
                      });
                      if (!res.ok) throw new Error('Failed to submit feedback');
                      setShowFeedbackModal(false);
                      setFeedbackText('');
                      setStarRating(0);
                      alert('Thank you for your feedback!');
                    } catch (err) {
                      alert('Error submitting feedback: ' + err.message);
                    } finally {
                      setSubmittingFeedback(false);
                    }
                  }}
                  disabled={starRating === 0 || feedbackText.trim() === '' || submittingFeedback}
                >
                  {submittingFeedback ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          )}
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
            <SmartContentSuggestions />
          </div>
        <div className="dashboard-right">
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

function SmartContentSuggestions() {
  // Example static content, replace with real AI-powered data as needed
  const suggestions = [
    {
      icon: '💡',
      title: 'Post Idea',
      text: 'Share a behind-the-scenes look at your creative process.',
      tooltip: 'AI analyzed your recent posts and audience engagement to suggest this idea.'
    },
    {
      icon: '⏰',
      title: 'Best Time to Post',
      text: 'Wednesday at 6:00 PM',
      tooltip: 'AI recommends this time based on your followers\' activity patterns.'
    },
    {
      icon: '🏷️',
      title: 'Suggested Hashtags',
      text: '#Inspiration #BehindTheScenes #YourBrand',
      tooltip: 'AI selected hashtags to maximize reach and relevance.'
    }
  ];
  return (
    <div className="smart-suggestions-glass">
      <h2 className="smart-suggestions-heading">Smart Content Suggestions (AI)</h2>
      <div className="smart-suggestions-list">
        {suggestions.map((s, i) => (
          <div className="smart-suggestion-item" key={i}>
            <span className="smart-suggestion-icon">{s.icon}</span>
            <div className="smart-suggestion-content">
              <div className="smart-suggestion-title">{s.title}</div>
              <div className="smart-suggestion-text">{s.text}</div>
            </div>
            <span className="smart-suggestion-tooltip" title={s.tooltip}>🛈</span>
          </div>
        ))}
      </div>
      <div className="smart-suggestions-caption">Powered by AI & performance analytics</div>
    </div>
  );
}

export default Home; 