import React, { useState } from 'react';
import { generateCaption } from '../utils/captionGen';

export default function CaptionGenerator() {
  const [filename, setFilename] = useState('');
  const [keywords, setKeywords] = useState('');
  const [caption, setCaption] = useState('');

  const handleGenerate = () => {
    const kwArr = keywords.split(',').map(k => k.trim()).filter(Boolean);
    setCaption(generateCaption({ filename, keywords: kwArr }));
  };

  return (
    <div className="caption-generator" style={{ margin: '8px 0' }}>
      <b>Caption Generator</b>
      <div style={{ margin: '6px 0' }}>
        <input
          type="text"
          placeholder="Image filename (optional)"
          value={filename}
          onChange={e => setFilename(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Keywords (comma separated)"
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          style={{ marginRight: 8 }}
        />
        <button onClick={handleGenerate}>Generate Caption</button>
      </div>
      {caption && <div style={{ marginTop: 6, fontStyle: 'italic' }}>{caption}</div>}
    </div>
  );
} 