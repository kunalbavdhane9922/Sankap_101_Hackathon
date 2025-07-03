// Mock SEO Engine API
// Input: { content, platform, audience, niche }
// Output: { hashtags: [], trendingTags: [], title: '' }

const platformTrends = {
  instagram: ["#InstaGood", "#PhotoOfTheDay", "#NoFilter"],
  facebook: ["#FBTrends", "#Viral", "#ShareNow"],
  youtube: ["#Subscribe", "#Vlog", "#TrendingNow"],
  twitter: ["#Breaking", "#NowPlaying", "#ViralTweet"],
};

const nicheTemplates = {
  fitness: ["Get Fit Fast", "Top 5 Workouts", "Healthy Living Tips"],
  travel: ["Explore the World", "Hidden Gems", "Travel Hacks"],
  tech: ["Latest Gadgets", "Tech Explained", "How-To Guides"],
  default: ["Must See!", "Top Tips", "Don\'t Miss Out!"],
};

function extractKeywords(content) {
  // Dummy: pick most frequent words >3 chars
  const words = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
  const freq = {};
  words.forEach(w => freq[w] = (freq[w]||0)+1);
  return Object.entries(freq)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,3)
    .map(([w])=>w);
}

function suggestHashtags(keywords, platform) {
  return keywords.map(k => `#${k}`).concat(platformTrends[platform] || []);
}

function suggestTitle(keywords, niche) {
  const templates = nicheTemplates[niche] || nicheTemplates.default;
  return templates[Math.floor(Math.random()*templates.length)] + ': ' + keywords.join(' ');
}

module.exports = (req, res) => {
  let body = req.body;
  if (!body && req.method === "POST") {
    let data = "";
    req.on("data", chunk => { data += chunk; });
    req.on("end", () => {
      body = JSON.parse(data || '{}');
      respond(body, res);
    });
  } else {
    respond(body || {}, res);
  }
};

function respond({ content, platform, audience, niche }, res) {
  if (!content) content = "Your awesome post here";
  if (!platform) platform = "instagram";
  if (!niche) niche = "default";
  const keywords = extractKeywords(content);
  const hashtags = suggestHashtags(keywords, platform);
  const trendingTags = (platformTrends[platform] || []).slice(0,2);
  const title = suggestTitle(keywords, niche);
  res.json({ hashtags, trendingTags, title });
} 