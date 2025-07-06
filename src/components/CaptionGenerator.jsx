import { generateCaptionAI } from '../utils/captionGen';
import React, { useState } from 'react';

export default function CaptionGenerator() {
  const [filename, setFilename] = useState('');
  const [keywords, setKeywords] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setCaption('');
    setError('');
    setLoading(true);
    
    try {
      const kwArr = keywords.split(',').map(k => k.trim()).filter(k => k);
      const result = await generateCaptionAI({ filename, keywords: kwArr });
      setCaption(result);
    } catch (err) {
      setError('Failed to generate caption.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="caption-generator" style={{ margin: '16px 0', padding: 16, background: '#f8fafc', borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color: '#7d4cff' }}>AI Caption Generator</div>
      
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Image Filename:</label>
        <input 
          type="text" 
          value={filename} 
          onChange={(e) => setFilename(e.target.value)}
          placeholder="e.g., sunset-beach.jpg"
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
        />
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Keywords (comma-separated):</label>
        <input 
          type="text" 
          value={keywords} 
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g., sunset, beach, relaxation"
          style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
        />
      </div>
      
      <button 
        onClick={handleGenerate} 
        disabled={loading}
        style={{ 
          background: '#7d4cff', 
          color: 'white', 
          border: 'none', 
          borderRadius: 6, 
          padding: '8px 16px', 
          fontWeight: 600, 
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'Generating...' : 'Generate Caption'}
      </button>
      
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      
      {caption && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Generated Caption:</div>
          <textarea 
            value={caption} 
            readOnly 
            rows={3} 
            style={{ 
              width: '100%', 
              borderRadius: 6, 
              border: '1px solid #ddd', 
              padding: 8, 
              fontStyle: 'italic', 
              background: '#f4f4ff', 
              color: '#333', 
              resize: 'none' 
            }} 
          />
        </div>
      )}
    </div>
  );
} 