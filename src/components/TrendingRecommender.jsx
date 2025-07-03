import React, { useState } from 'react';

export default function TrendingRecommender({ platform, viewCount, avgViewCount }) {
  const [topics, setTopics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const shouldRecommend = viewCount < avgViewCount * 0.8;

  const fetchTopics = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/src/backend/trendingTopics.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform })
      });
      if (!res.ok) throw new Error('Failed to fetch trending topics');
      const data = await res.json();
      setTopics(data.topics);
    } catch (e) {
      setError(e.message);
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