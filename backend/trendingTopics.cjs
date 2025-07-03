// Mock Trending Topics API
// Input: { platform }
// Output: { topics: [ ... ] }

const trending = {
  instagram: [
    "How to style your summer outfits",
    "Quick healthy breakfast ideas",
    "Behind the scenes of a photoshoot"
  ],
  facebook: [
    "Local community heroes",
    "Tips for remote work success",
    "Family-friendly weekend activities"
  ],
  youtube: [
    "Unboxing the latest tech gadgets",
    "Day in the life vlogs",
    "Beginner's guide to investing"
  ],
  twitter: [
    "#MondayMotivation stories",
    "Live reactions to trending news",
    "Poll: What's your favorite app?"
  ],
  default: [
    "Share your best productivity hack",
    "What inspires you every day?",
    "How do you unwind after work?"
  ]
};

module.exports = (req, res) => {
  let platform = req.query?.platform || req.body?.platform || 'default';
  if (!platform) platform = 'default';
  res.json({ topics: trending[platform] || trending.default });
}; 