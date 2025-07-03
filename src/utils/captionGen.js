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