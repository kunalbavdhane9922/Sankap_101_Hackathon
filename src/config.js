const API_BASE_URL = "https://sankap-101-hackathon-1.onrender.com";

// AI API Configuration
export const AI_CONFIG = {
  API_KEY: "AIzaSyA0lO0q8iwmraUEotzY1dS93cG7LBfjmVs",
  OPENAI_API_URL: "https://api.openai.com/v1",
  GOOGLE_AI_URL: "https://generativelanguage.googleapis.com/v1beta/models",
  // Add other AI service endpoints as needed
};

// AI Service Functions
export const AI_SERVICES = {
  // OpenAI GPT for caption generation, sentiment analysis, etc.
  openai: {
    generateCaption: async (prompt) => {
      try {
        const response = await fetch(`${AI_CONFIG.OPENAI_API_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a social media expert who creates engaging captions and content."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            max_tokens: 150,
            temperature: 0.7
          })
        });
        
        if (!response.ok) {
          throw new Error('OpenAI API request failed');
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
      } catch (error) {
        console.error('OpenAI API Error:', error);
        // Fallback to dummy response
        return "Amazing content! Thanks for sharing this with us. #awesome #content";
      }
    },

    analyzeSentiment: async (text) => {
      try {
        const response = await fetch(`${AI_CONFIG.OPENAI_API_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "Analyze the sentiment of the given text and return a JSON response with 'sentiment' (positive/negative/neutral) and 'score' (-1 to 1)."
              },
              {
                role: "user",
                content: `Analyze sentiment: "${text}"`
              }
            ],
            max_tokens: 100,
            temperature: 0.3
          })
        });
        
        if (!response.ok) {
          throw new Error('OpenAI API request failed');
        }
        
        const data = await response.json();
        const result = JSON.parse(data.choices[0].message.content);
        return result;
      } catch (error) {
        console.error('OpenAI API Error:', error);
        // Fallback to dummy sentiment analysis
        return { sentiment: 'neutral', score: 0 };
      }
    },

    generateHashtags: async (content, platform, niche) => {
      try {
        const response = await fetch(`${AI_CONFIG.OPENAI_API_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are a social media expert. Generate relevant hashtags for ${platform} in the ${niche} niche. Return only hashtags separated by spaces.`
              },
              {
                role: "user",
                content: `Generate hashtags for: "${content}"`
              }
            ],
            max_tokens: 100,
            temperature: 0.7
          })
        });
        
        if (!response.ok) {
          throw new Error('OpenAI API request failed');
        }
        
        const data = await response.json();
        const hashtags = data.choices[0].message.content.split(' ').filter(tag => tag.startsWith('#'));
        return hashtags;
      } catch (error) {
        console.error('OpenAI API Error:', error);
        // Fallback to dummy hashtags
        return ['#content', '#socialmedia', '#post'];
      }
    },

    generateReplies: async (content) => {
      try {
        const response = await fetch(`${AI_CONFIG.OPENAI_API_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "Generate 3 engaging social media replies that users might comment on this post. Make them positive, curious, and engaging."
              },
              {
                role: "user",
                content: `Generate replies for: "${content}"`
              }
            ],
            max_tokens: 150,
            temperature: 0.8
          })
        });
        
        if (!response.ok) {
          throw new Error('OpenAI API request failed');
        }
        
        const data = await response.json();
        const replies = data.choices[0].message.content.split('\n').filter(reply => reply.trim());
        return replies.slice(0, 3);
      } catch (error) {
        console.error('OpenAI API Error:', error);
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
        const response = await fetch(`${AI_CONFIG.OPENAI_API_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `Generate 3 trending topic suggestions for ${platform}. Make them engaging and relevant to current trends.`
              },
              {
                role: "user",
                content: "What are trending topics right now?"
              }
            ],
            max_tokens: 150,
            temperature: 0.8
          })
        });
        
        if (!response.ok) {
          throw new Error('OpenAI API request failed');
        }
        
        const data = await response.json();
        const topics = data.choices[0].message.content.split('\n').filter(topic => topic.trim());
        return topics.slice(0, 3);
      } catch (error) {
        console.error('OpenAI API Error:', error);
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