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
      const aiTopics = await AI_SERVICES.openai.getTrendingTopics(platform);
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

  React.useEffect(() => {
    if (shouldRecommend) fetchTopics();
    // eslint-disable-next-line
  }, [platform, viewCount, avgViewCount]);

  if (!shouldRecommend) return <div style={{ color: 'green' }}>Views are healthy. No recommendations needed!</div>;

  return (
    <div className="trending-recommender">
      <b>Trending Topic Ideas:</b>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {topics && (
        <ul>
          {topics.map((t, i) => <li key={i}>{t}</li>)}
        </ul>
      )}
    </div>
  );
} 