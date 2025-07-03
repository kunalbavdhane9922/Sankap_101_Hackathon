// Dummy best post timing utility
// Usage: getBestTimes(platform) => [ ... ]

const bestTimes = {
  instagram: ['8:00 AM', '1:00 PM', '7:00 PM'],
  facebook: ['9:00 AM', '12:00 PM', '5:00 PM'],
  youtube: ['11:00 AM', '3:00 PM', '8:00 PM'],
  twitter: ['7:00 AM', '12:00 PM', '6:00 PM'],
  default: ['10:00 AM', '2:00 PM', '8:00 PM']
};

export function getBestTimes(platform) {
  return bestTimes[platform] || bestTimes.default;
} 