const API_BASE_URL = "https://sankap-101-hackathon-1.onrender.com";

// AI Service Functions - Proxy to backend Gemini API
export const AI_SERVICES = {
  gemini: {
    generateCaption: async (prompt) => {
      try {
        const response = await fetch(`/api/gemini`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'caption', prompt })
        });
        if (!response.ok) throw new Error('Gemini proxy API request failed');
        const data = await response.json();
        return data.result;
      } catch (error) {
        console.error('Gemini Proxy API Error:', error);
        return "Amazing content! Thanks for sharing this with us. #awesome #content";
      }
    },
    analyzeSentiment: async (text) => {
      try {
        const response = await fetch(`/api/gemini`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'sentiment', text })
        });
        if (!response.ok) throw new Error('Gemini proxy API request failed');
        const data = await response.json();
        return JSON.parse(data.result);
      } catch (error) {
        console.error('Gemini Proxy API Error:', error);
        return { sentiment: 'neutral', score: 0 };
      }
    },
    generateHashtags: async (content, platform, niche) => {
      try {
        const response = await fetch(`/api/gemini`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'hashtags', content, platform, niche })
        });
        if (!response.ok) throw new Error('Gemini proxy API request failed');
        const data = await response.json();
        return data.result.split(' ').filter(tag => tag.startsWith('#'));
      } catch (error) {
        console.error('Gemini Proxy API Error:', error);
        return ['#content', '#socialmedia', '#post', '#engagement', '#viral'];
      }
    },
    generateReplies: async (content) => {
      try {
        const response = await fetch(`/api/gemini`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'replies', content })
        });
        if (!response.ok) throw new Error('Gemini proxy API request failed');
        const data = await response.json();
        return data.result.split('\n').filter(reply => reply.trim()).slice(0, 3);
      } catch (error) {
        console.error('Gemini Proxy API Error:', error);
        return [
          "Wow, this is so helpful!",
          "Can you share more on this?",
          "Love your insights 🔥"
        ];
      }
    },
    getTrendingTopics: async (platform) => {
      try {
        const response = await fetch(`/api/gemini`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'trending', platform })
        });
        if (!response.ok) throw new Error('Gemini proxy API request failed');
        const data = await response.json();
        return data.result.split('\n').filter(topic => topic.trim()).slice(0, 3);
      } catch (error) {
        console.error('Gemini Proxy API Error:', error);
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