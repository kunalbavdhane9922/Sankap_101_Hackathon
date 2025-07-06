const API_BASE_URL = "https://sankap-101-hackathon-1.onrender.com";

// AI API Configuration - Gemini AI
export const AI_CONFIG = {
  API_KEY: "AIzaSyA0lO0q8iwmraUEotzY1dS93cG7LBfjmVs",
  GEMINI_API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
  // Add other AI service endpoints as needed
};

// AI Service Functions - Gemini AI
export const AI_SERVICES = {
  // Gemini AI for caption generation, sentiment analysis, etc.
  gemini: {
    generateCaption: async (prompt) => {
      try {
        const response = await fetch(`${AI_CONFIG.GEMINI_API_URL}?key=${AI_CONFIG.API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a social media expert who creates engaging captions and content. ${prompt}`
              }]
            }]
          })
        });
        
        if (!response.ok) {
          throw new Error('Gemini API request failed');
        }
        
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      } catch (error) {
        console.error('Gemini API Error:', error);
        // Fallback to dummy response
        return "Amazing content! Thanks for sharing this with us. #awesome #content";
      }
    },

    analyzeSentiment: async (text) => {
      try {
        const response = await fetch(`${AI_CONFIG.GEMINI_API_URL}?key=${AI_CONFIG.API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze the sentiment of the given text and return a JSON response with 'sentiment' (positive/negative/neutral) and 'score' (-1 to 1). Text: "${text}"`
              }]
            }]
          })
        });
        
        if (!response.ok) {
          throw new Error('Gemini API request failed');
        }
        
        const data = await response.json();
        const result = JSON.parse(data.candidates[0].content.parts[0].text);
        return result;
      } catch (error) {
        console.error('Gemini API Error:', error);
        // Fallback to dummy sentiment analysis
        return { sentiment: 'neutral', score: 0 };
      }
    },

    generateHashtags: async (content, platform, niche) => {
      try {
        const response = await fetch(`${AI_CONFIG.GEMINI_API_URL}?key=${AI_CONFIG.API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Generate 5 relevant hashtags for a ${platform} post in the ${niche} niche with this content: "${content}". Return only the hashtags separated by spaces.`
              }]
            }]
          })
        });
        
        if (!response.ok) {
          throw new Error('Gemini API request failed');
        }
        
        const data = await response.json();
        const hashtags = data.candidates[0].content.parts[0].text.split(' ').filter(tag => tag.startsWith('#'));
        return hashtags;
      } catch (error) {
        console.error('Gemini API Error:', error);
        // Fallback to dummy hashtags
        return ['#content', '#socialmedia', '#post', '#engagement', '#viral'];
      }
    },

    generateReplies: async (content) => {
      try {
        const response = await fetch(`${AI_CONFIG.GEMINI_API_URL}?key=${AI_CONFIG.API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Generate 3 engaging social media replies that users might comment on this post. Make them positive, curious, and engaging. Post: "${content}"`
              }]
            }]
          })
        });
        
        if (!response.ok) {
          throw new Error('Gemini API request failed');
        }
        
        const data = await response.json();
        const replies = data.candidates[0].content.parts[0].text.split('\n').filter(reply => reply.trim());
        return replies.slice(0, 3);
      } catch (error) {
        console.error('Gemini API Error:', error);
        // Fallback to dummy replies
        return [
          "Wow, this is so helpful!",
          "Can you share more on this?",
          "Love your insights 🔥"
        ];
      }
    },

    getTrendingTopics: async (platform) => {
      try {
        const response = await fetch(`${AI_CONFIG.GEMINI_API_URL}?key=${AI_CONFIG.API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Generate 3 trending topic suggestions for ${platform}. Make them engaging and relevant to current trends.`
              }]
            }]
          })
        });
        
        if (!response.ok) {
          throw new Error('Gemini API request failed');
        }
        
        const data = await response.json();
        const topics = data.candidates[0].content.parts[0].text.split('\n').filter(topic => topic.trim());
        return topics.slice(0, 3);
      } catch (error) {
        console.error('Gemini API Error:', error);
        // Fallback to dummy topics
        return [
          "Share your best productivity hack",
          "What inspires you every day?",
          "How do you unwind after work?"
        ];
      }
    }
  }
};

export default API_BASE_URL; 