const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const GEMINI_API_KEY = "AIzaSyA0lO0q8iwmraUEotzY1dS93cG7LBfjmVs";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

// Helper to build prompt based on type
function buildPrompt(type, data) {
  switch (type) {
    case 'caption':
      return `You are a social media expert who creates engaging captions and content. ${data.prompt}`;
    case 'sentiment':
      return `Analyze the sentiment of the given text and return a JSON response with 'sentiment' (positive/negative/neutral) and 'score' (-1 to 1). Text: "${data.text}"`;
    case 'hashtags':
      return `Generate 5 relevant hashtags for a ${data.platform} post in the ${data.niche} niche with this content: "${data.content}". Return only the hashtags separated by spaces.`;
    case 'replies':
      return `Generate 3 engaging social media replies that users might comment on this post. Make them positive, curious, and engaging. Post: "${data.content}"`;
    case 'trending':
      return `Generate 3 trending topic suggestions for ${data.platform}. Make them engaging and relevant to current trends.`;
    default:
      return data.prompt || '';
  }
}

router.post('/api/gemini', async (req, res) => {
  try {
    const { type, ...data } = req.body;
    const prompt = buildPrompt(type, data);
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini API error:', errText); // Log Gemini API error
      return res.status(500).json({ error: 'Gemini API error', details: errText });
    }
    const geminiData = await geminiRes.json();
    const output = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ result: output });
  } catch (err) {
    console.error('Gemini Proxy Server error:', err); // Log server error
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router; 