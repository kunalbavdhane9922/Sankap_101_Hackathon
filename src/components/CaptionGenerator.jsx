import React, { useState } from 'react';
import { generateCaptionAI } from '../utils/captionGen';

export default function CaptionGenerator() {
  const [filename, setFilename] = useState('');
  const [keywords, setKeywords] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setCaption('');
    try {
      const kwArr = keywords.split(',').map(k => k.trim()).filter(Boolean);
      const result = await generateCaptionAI({ filename, keywords: kwArr });
      setCaption(result);
    } catch (e) {
      setError('Failed to generate caption.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="caption-generator" style={{ margin: '16px 0', padding: 16, background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color: '#7d4cff' }}>AI Caption Generator</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Image filename (optional)"
          value={filename}
          onChange={e => setFilename(e.target.value)}
          style={{ flex: 1, minWidth: 180, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <input
          type="text"
          placeholder="Keywords (comma separated)"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          style={{ flex: 2, minWidth: 220, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{ background: '#7d4cff', color: 'white', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', minWidth: 120 }}
        >
          {loading ? 'Generating...' : 'Generate Caption'}
        </button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      {caption && (
        <textarea
          value={caption}
          readOnly
          rows={2}
          style={{ width: '100%', marginTop: 8, borderRadius: 6, border: '1px solid #ddd', padding: 8, fontStyle: 'italic', background: '#f4f4ff', color: '#333', resize: 'none' }}
        />
      )}
    </div>
  );
} 