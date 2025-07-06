import React, { useState, useEffect } from 'react';
import { analyzeSentiment, analyzeSentimentAI } from '../utils/sentiment';

export default function SentimentAnalyzer({ text }) {
  const [sentiment, setSentiment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!text) {
      setSentiment(null);
      return;
    }

    const analyzeText = async () => {
      setLoading(true);
      try {
        // Try AI-powered sentiment analysis first
        const aiResult = await analyzeSentimentAI(text);
        setSentiment(aiResult);
      } catch (error) {
        console.error('AI sentiment analysis failed, using fallback:', error);
        // Fallback to dummy sentiment analysis
        const fallbackResult = analyzeSentiment(text);
        setSentiment(fallbackResult);
      } finally {
        setLoading(false);
      }
    };

    analyzeText();
  }, [text]);

  if (!text || !sentiment) return null;

  let color = '#888';
  if (sentiment.sentiment === 'positive' || sentiment.sentiment === 'happy') color = 'green';
  else if (sentiment.sentiment === 'negative' || sentiment.sentiment === 'sad') color = 'blue';
  else if (sentiment.sentiment === 'angry') color = 'red';

  return (
    <div style={{ margin: '8px 0' }}>
      <b>Sentiment:</b> 
      {loading ? (
        <span> Analyzing...</span>
      ) : (
        <span style={{ color }}> {sentiment.sentiment} ({sentiment.score})</span>
      )}
    </div>
  );
} 