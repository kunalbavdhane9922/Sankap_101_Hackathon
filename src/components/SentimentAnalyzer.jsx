import React from 'react';
import { analyzeSentiment } from '../utils/sentiment';

export default function SentimentAnalyzer({ text }) {
  if (!text) return null;
  const { sentiment, score } = analyzeSentiment(text);
  let color = '#888';
  if (sentiment === 'happy') color = 'green';
  else if (sentiment === 'sad') color = 'blue';
  else if (sentiment === 'angry') color = 'red';

  return (
    <div style={{ margin: '8px 0' }}>
      <b>Sentiment:</b> <span style={{ color }}>{sentiment} ({score})</span>
    </div>
  );
} 