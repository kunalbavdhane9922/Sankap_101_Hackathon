import React from 'react';

const platformStyles = {
  instagram: {
    border: '2px solid #e1306c', borderRadius: 12, padding: 12, background: '#fff0f6', color: '#222', maxWidth: 350
  },
  twitter: {
    border: '2px solid #1da1f2', borderRadius: 12, padding: 12, background: '#f0faff', color: '#222', maxWidth: 350
  },
  youtube: {
    border: '2px solid #ff0000', borderRadius: 12, padding: 12, background: '#fff5f5', color: '#222', maxWidth: 350
  },
  facebook: {
    border: '2px solid #1877f3', borderRadius: 12, padding: 12, background: '#f0f4ff', color: '#222', maxWidth: 350
  },
  default: {
    border: '2px solid #aaa', borderRadius: 12, padding: 12, background: '#f8f8f8', color: '#222', maxWidth: 350
  }
};

export default function PostPreview({ content, image, platform, hashtags }) {
  const style = platformStyles[platform] || platformStyles.default;
  return (
    <div className="post-preview" style={style}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Preview'}</div>
      {image && <img src={image} alt="preview" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />}
      <div style={{ marginBottom: 6 }}>{content}</div>
      {hashtags && <div style={{ color: '#888', fontSize: 13 }}>{hashtags.join(' ')}</div>}
    </div>
  );
} 