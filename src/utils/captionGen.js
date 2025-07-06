import { AI_SERVICES } from '../config';

// Dummy caption generator utility (fallback)
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

// AI-powered caption generation using Gemini AI
export async function generateCaptionAI({ filename = '', keywords = [] }) {
  try {
    // Create a prompt for the AI
    let prompt = "Generate an engaging social media caption";
    
    if (keywords && keywords.length > 0) {
      prompt += ` using these keywords: ${keywords.join(', ')}`;
    }
    
    if (filename) {
      prompt += ` for an image about: ${filename.split('.')[0].replace(/[-_]/g, ' ')}`;
    }
    
    prompt += ". Make it engaging, authentic, and include relevant hashtags.";
    
    // Use the AI service
    const result = await AI_SERVICES.gemini.generateCaption(prompt);
    return result;
  } catch (error) {
    console.error('Gemini Caption Generation Error:', error);
    // Fallback to dummy caption
    const fallback = generateCaption({ filename, keywords });
    return fallback + ' (AI)';
  }
} 