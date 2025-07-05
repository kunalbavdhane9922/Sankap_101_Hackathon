// Dummy sentiment analysis utility
// Usage: analyzeSentiment(text) => { sentiment: 'happy'|'sad'|'angry'|'neutral', score: -1..1 }

const { geminiGenerateContent } = require('../../backend/utils/gemini');

async function analyzeSentiment(text) {
  const prompt = `Analyze the sentiment of the following text and respond with one word: Positive, Negative, or Neutral.\nText: ${text}`;
  return await geminiGenerateContent(prompt, 'You are a sentiment analysis AI.');
}

module.exports = { analyzeSentiment }; 