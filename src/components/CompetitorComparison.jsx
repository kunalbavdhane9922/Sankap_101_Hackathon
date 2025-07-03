import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config";

// Fetch from backend
function fetchCompetitorData(niche) {
  return fetch(`${API_BASE_URL}/compareCompetitors?niche=${encodeURIComponent(niche)}`)
    .then(res => res.json());
}

const COLORS = {
  you: '#7d4cff',
  topCompetitor: '#ff4c4c',
  average: '#4cc9ff'
};

export default function CompetitorComparison({ niche }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchCompetitorData(niche)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load competitor data");
        setLoading(false);
      });
  }, [niche]);

  if (loading) return <div>Loading competitor comparison...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!data) return <div>No data available.</div>;

  // Find max for scaling bars
  const maxFollowers = Math.max(data.you.followers, data.topCompetitor.followers, data.average.followers);
  const maxEngagement = Math.max(data.you.engagement, data.topCompetitor.engagement, data.average.engagement);

  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24, margin: '24px 0' }}>
      <h2>Competitor Comparison</h2>
      <p style={{ color: '#555', marginBottom: 18 }}>
        See how your followers and engagement compare to others in the <b>{niche}</b> niche. This uses live data from your database.
      </p>
      <div style={{ display: 'flex', gap: 32, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {/* Followers Bar Chart */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <h4>Followers</h4>
          {["you", "topCompetitor", "average"].map(key => (
            <div key={key} style={{ marginBottom: 10 }}>
              <span style={{ display: 'inline-block', width: 110 }}>{key === 'you' ? 'You' : key === 'topCompetitor' ? 'Top Competitor' : 'Average'}</span>
              <div style={{ display: 'inline-block', verticalAlign: 'middle', height: 18, background: '#eee', borderRadius: 8, width: 120 }}>
                <div style={{
                  width: `${maxFollowers ? (data[key].followers / maxFollowers) * 100 : 0}%`,
                  background: COLORS[key],
                  height: '100%',
                  borderRadius: 8
                }} />
              </div>
              <span style={{ marginLeft: 10, fontWeight: 600 }}>{data[key].followers}</span>
            </div>
          ))}
        </div>
        {/* Engagement Bar Chart */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <h4>Engagement (%)</h4>
          {["you", "topCompetitor", "average"].map(key => (
            <div key={key} style={{ marginBottom: 10 }}>
              <span style={{ display: 'inline-block', width: 110 }}>{key === 'you' ? 'You' : key === 'topCompetitor' ? 'Top Competitor' : 'Average'}</span>
              <div style={{ display: 'inline-block', verticalAlign: 'middle', height: 18, background: '#eee', borderRadius: 8, width: 120 }}>
                <div style={{
                  width: `${maxEngagement ? (data[key].engagement / maxEngagement) * 100 : 0}%`,
                  background: COLORS[key],
                  height: '100%',
                  borderRadius: 8
                }} />
              </div>
              <span style={{ marginLeft: 10, fontWeight: 600 }}>{data[key].engagement}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 18, color: '#888', fontSize: 14 }}>
        <b>Note:</b> This is now a live feature using your database. In a real app, data would come from social APIs and ML models.
      </div>
    </div>
  );
} 