import React, { useState } from 'react';
import API_BASE_URL from "../config";
import { AI_SERVICES } from "../config";

const NICHES = ['default', 'fitness', 'travel', 'tech', 'fashion', 'education', 'finance', 'food', 'lifestyle', 'gaming'];

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
      // Try AI-powered hashtag generation first
      const aiHashtags = await AI_SERVICES.gemini.generateHashtags(content, platform, niche);
      
      // Create suggestions object with AI-generated hashtags
      const aiSuggestions = {
        hashtags: aiHashtags,
        trendingTags: aiHashtags.slice(0, 3), // Use first 3 as trending
        title: `AI-generated title for ${platform} post`
      };
      
      setSuggestions(aiSuggestions);
      
      // Also call the backend for additional data (fallback)
      try {
        const res = await fetch(`${API_BASE_URL}/seoEngine`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, platform, audience, niche })
        });
        if (res.ok) {
          const backendData = await res.json();
          // Merge AI and backend data
          setSuggestions({
            hashtags: [...new Set([...aiHashtags, ...backendData.hashtags])],
            trendingTags: [...new Set([...aiSuggestions.trendingTags, ...backendData.trendingTags])],
            title: backendData.title || aiSuggestions.title
          });
        }
      } catch (backendError) {
        console.log('Backend fallback failed, using AI suggestions only');
      }
    } catch (e) {
      setError(e.message);
      // Fallback to backend only
      try {
        const res = await fetch(`${API_BASE_URL}/seoEngine`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, platform, audience, niche })
        });
        if (!res.ok) throw new Error('Failed to fetch suggestions');
        const data = await res.json();
        setSuggestions(data);
      } catch (backendError) {
        setError('Both AI and backend services failed');
      }
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
        <label className="niche-label">Niche: </label>
        <select className="niche-select" value={niche} onChange={handleNicheChange}>
          {NICHES.map((n) => (
            <option key={n} value={n}>{n.charAt(0).toUpperCase() + n.slice(1)}</option>
          ))}
        </select>
        <button className="suggest-btn" onClick={fetchSuggestions} disabled={loading} style={{ marginLeft: 8 }}>
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
