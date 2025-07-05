// Dummy caption generator utility
// Usage: generateCaption({ filename, keywords }) => string

const templates = [
  "When in doubt, just smile!",
  "Captured the moment perfectly.",
  "A picture is worth a thousand words.",
  "Adventure awaits!",
  "Making memories one snap at a time.",
  "This made my day!",
  "#nofilter needed for this shot.",
  "Living my best life!"
];

export function generateCaption({ filename = '', keywords = [] }) {
  // Use keywords or filename to pick a template
  if (keywords && keywords.length) {
    return `"${keywords[0]}" vibes. ${templates[Math.floor(Math.random()*templates.length)]}`;
  }
  if (filename) {
    const base = filename.split('.')[0].replace(/[-_]/g, ' ');
    return `About "${base}": ${templates[Math.floor(Math.random()*templates.length)]}`;
  }
  return templates[Math.floor(Math.random()*templates.length)];
}

// Node.js backend version for Gemini
const { geminiGenerateContent } = require('../../backend/utils/gemini');

async function generateCaptionAI({ filename, keywords }) {
  const prompt = `Generate a catchy social media caption for an image with these keywords: ${keywords.join(', ')}.`;
  return await geminiGenerateContent(prompt, 'You are a creative social media assistant.');
}

async function suggestHashtagsAI({ content, platform }) {
  const prompt = `Suggest 5 trending hashtags for a ${platform} post with this content: ${content}. Return only the hashtags separated by spaces.`;
  const result = await geminiGenerateContent(prompt, 'You are a social media hashtag expert.');
  return result.match(/#[\w]+/g) || [];
}

module.exports = { generateCaptionAI, suggestHashtagsAI }; 