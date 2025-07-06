import { AI_SERVICES } from '../config';

// Dummy sentiment analysis utility (fallback)
// Usage: analyzeSentiment(text) => { sentiment: 'happy'|'sad'|'angry'|'neutral', score: -1..1 }

const happyWords = ['happy', 'joy', 'love', 'great', 'awesome', 'excited', 'fun', 'smile'];
const sadWords = ['sad', 'cry', 'bad', 'unhappy', 'depressed', 'down', 'blue'];
const angryWords = ['angry', 'mad', 'hate', 'furious', 'rage', 'annoyed'];

export function analyzeSentiment(text) {
  const t = text.toLowerCase();
  let score = 0;
  happyWords.forEach(w => { if (t.includes(w)) score += 1; });
  sadWords.forEach(w => { if (t.includes(w)) score -= 1; });
  angryWords.forEach(w => { if (t.includes(w)) score -= 2; });
  let sentiment = 'neutral';
  if (score > 0) sentiment = 'happy';
  else if (score < -1) sentiment = 'angry';
  else if (score < 0) sentiment = 'sad';
  return { sentiment, score: Math.max(-1, Math.min(1, score/3)) };
}

// AI-powered sentiment analysis using Gemini AI
export async function analyzeSentimentAI(text) {
  try {
    const result = await AI_SERVICES.gemini.analyzeSentiment(text);
    return result;
  } catch (error) {
    console.error('Gemini Sentiment Analysis Error:', error);
    // Fallback to dummy sentiment analysis
    return analyzeSentiment(text);
  }
} 