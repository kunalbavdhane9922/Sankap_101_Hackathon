import React, { useState, useEffect } from "react";
import { generateReplies, generateRepliesAI } from "../utils/smartReplies";

const ReplySuggestions = ({ content }) => {
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!content) {
      setReplies([]);
      return;
    }

    const generateSmartReplies = async () => {
      setLoading(true);
      try {
        // Try AI-powered smart replies first
        const aiReplies = await generateRepliesAI(content);
        setReplies(aiReplies);
      } catch (error) {
        console.error('AI smart replies failed, using fallback:', error);
        // Fallback to dummy replies
        const fallbackReplies = generateReplies(content);
        setReplies(fallbackReplies);
      } finally {
        setLoading(false);
      }
    };

    generateSmartReplies();
  }, [content]);

  if (!content || replies.length === 0) return null;

  return (
    <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f6f6f6', borderRadius: '8px' }}>
      <strong>Smart Replies:</strong>
      {loading ? (
        <div>Generating replies...</div>
      ) : (
        <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
          {replies.map((reply, idx) => (
            <li key={idx}>{reply}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReplySuggestions; 