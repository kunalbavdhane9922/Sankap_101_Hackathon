import React from "react";
import { generateReplies } from "../utils/smartReplies";

const ReplySuggestions = ({ content }) => {
  const replies = generateReplies(content);
  return (
    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f6f6f6', borderRadius: '8px' }}>
      <strong>Smart Replies:</strong>
      <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
        {replies.map((reply, idx) => (
          <li key={idx}>{reply}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReplySuggestions; 