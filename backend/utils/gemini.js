const fetch = require('node-fetch');
const { GEMINI_API_KEY } = require('../config');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

async function geminiGenerateContent(prompt, systemInstruction = '') {
  const body = {
    contents: [
      ...(systemInstruction ? [{ role: 'system', parts: [{ text: systemInstruction }] }] : []),
      { role: 'user', parts: [{ text: prompt }] }
    ]
  };
  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Gemini API error');
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

module.exports = { geminiGenerateContent }; 