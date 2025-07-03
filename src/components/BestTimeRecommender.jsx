import React from 'react';
import { getBestTimes } from '../utils/bestTimes';

export default function BestTimeRecommender({ platform }) {
  const times = getBestTimes(platform);
  return (
    <div className="best-time-recommender" style={{ margin: '8px 0' }}>
      <b>Best Times to Post:</b>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {times.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
} 