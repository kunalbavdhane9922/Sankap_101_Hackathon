import React, { useState } from 'react';
import API_BASE_URL from "../config";
import { AI_SERVICES } from "../config";

export default function TrendingRecommender({ platform, viewCount, avgViewCount }) {
  const [topics, setTopics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shouldRecommend = viewCount < avgViewCount * 0.8;

  const fetchTopics = async () => {
    setLoading(true);
    setError('');
    try {
      // Try AI-powered trending topics first
      const aiTopics = await AI_SERVICES.gemini.getTrendingTopics(platform);
      setTopics(aiTopics);
      
      // Also call the backend for additional data (fallback)
      try {
        const res = await fetch(`${API_BASE_URL}/trendingTopics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform })
        });
        if (res.ok) {
          const backendData = await res.json();
          // Merge AI and backend topics
          const mergedTopics = [...new Set([...aiTopics, ...backendData.topics])];
          setTopics(mergedTopics);
        }
      } catch (backendError) {
        console.log('Backend fallback failed, using AI topics only');
      }
    } catch (e) {
      setError(e.message);
      // Fallback to backend only
      try {
        const res = await fetch(`${API_BASE_URL}/trendingTopics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform })
        });
        if (!res.ok) throw new Error('Failed to fetch trending topics');
        const data = await res.json();
        setTopics(data.topics);
      } catch (backendError) {
        setError('Both AI and backend services failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!shouldRecommend) return null;

  return (
    <div style={{ margin: '16px 0', padding: 16, background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color: '#7d4cff' }}>
        Trending Topics for {platform}
      </div>
      <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: 12 }}>
        Your views are below average. Try these trending topics to boost engagement!
      </div>
      
      {!topics && !loading && (
        <button 
          onClick={fetchTopics}
          style={{ 
            background: '#7d4cff', 
            color: 'white', 
            border: 'none', 
            borderRadius: 6, 
            padding: '8px 16px', 
            fontWeight: 600, 
            cursor: 'pointer' 
          }}
        >
          Get Trending Topics
        </button>
      )}
      
      {loading && <div>Loading trending topics...</div>}
      
      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      {topics && (
        <div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Suggested Topics:</div>
          <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
            {topics.map((topic, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>{topic}</li>
            ))}
          </ul>
          <button 
            onClick={fetchTopics}
            style={{ 
              marginTop: 12,
              background: '#22c55e', 
              color: 'white', 
              border: 'none', 
              borderRadius: 6, 
              padding: '6px 12px', 
              fontWeight: 600, 
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Refresh Topics
          </button>
        </div>
      )}
    </div>
  );
} 