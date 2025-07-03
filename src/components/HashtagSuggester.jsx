import React, { useState } from 'react';
import API_BASE_URL from "../config";

const getNiche = () => localStorage.getItem('niche') || 'default';
const setNiche = (niche) => localStorage.setItem('niche', niche);

export default function HashtagSuggester({ content, platform, audience }) {
  const [niche, setNicheState] = useState(getNiche());
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSuggestions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/seoEngine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platform, audience, niche })
      });
      if (!res.ok) throw new Error('Failed to fetch suggestions');
      const data = await res.json();
      setSuggestions(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNicheChange = (e) => {
    setNicheState(e.target.value);
    setNiche(e.target.value);
  };

  return (
    <div className="hashtag-suggester">
      <div style={{ marginBottom: 8 }}>
        <label>Niche: </label>
        <input value={niche} onChange={handleNicheChange} placeholder="e.g. fitness, travel, tech" />
        <button onClick={fetchSuggestions} disabled={loading} style={{ marginLeft: 8 }}>
          {loading ? 'Loading...' : 'Suggest Tags & Title'}
        </button>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {suggestions && (
        <div className="suggestion-results">
          <div><b>SEO Title:</b> {suggestions.title}</div>
          <div><b>Hashtags:</b> {suggestions.hashtags.join(' ')}</div>
          <div><b>Trending Tags:</b> {suggestions.trendingTags.join(' ')}</div>
        </div>
      )}
    </div>
  );
} 