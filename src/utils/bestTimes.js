// Dummy best post timing utility
// Usage: getBestTimes(platform) => [ ... ]

const { geminiGenerateContent } = require('../../backend/utils/gemini');

async function getBestTimesToPost({ platform, niche }) {
  const prompt = `For the ${platform} platform and the ${niche} niche, suggest the 3 best times of day to post for maximum engagement. Respond with times only, separated by commas.`;
  const result = await geminiGenerateContent(prompt, 'You are a social media analytics expert.');
  return result.split(',').map(t => t.trim()).filter(Boolean);
}

module.exports = { getBestTimesToPost }; 