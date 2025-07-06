import { AI_SERVICES } from '../config';

// Dummy smart replies (fallback)
export function generateReplies(content) {
  // Dummy logic for smart replies based on post content
  return [
    "Wow, this is so helpful!",
    "Can you share more on this?",
    "Love your insights 🔥"
  ];
}

// AI-powered smart replies using Gemini AI
export async function generateRepliesAI(content) {
  try {
    const replies = await AI_SERVICES.gemini.generateReplies(content);
    return replies;
  } catch (error) {
    console.error('Gemini Smart Replies Error:', error);
    // Fallback to dummy replies
    return generateReplies(content);
  }
} 