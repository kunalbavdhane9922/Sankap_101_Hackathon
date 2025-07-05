const { geminiGenerateContent } = require('../../backend/utils/gemini');

async function getSmartReplies(text) {
  const prompt = `Suggest three short, smart, and context-aware replies to the following social media comment. Separate each reply with a newline.\nComment: ${text}`;
  const result = await geminiGenerateContent(prompt, 'You are a helpful social media assistant.');
  return result.split('\n').map(r => r.trim()).filter(Boolean);
}

module.exports = { getSmartReplies }; 