import "./Schedule.css";
// import Slidebar from "./Slidebar"; // Removed duplicate sidebar
import HashtagSuggester from "./HashtagSuggester";
import TrendingRecommender from "./TrendingRecommender";
import SentimentAnalyzer from "./SentimentAnalyzer";
import BestTimeRecommender from "./BestTimeRecommender";
import CaptionGenerator from "./CaptionGenerator";
import PostPreview from "./PostPreview";
import ReplySuggestions from "./ReplySuggestions";
import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config";

const PLATFORMS = [
  { label: "Instagram", value: "instagram" },
  { label: "Facebook", value: "facebook" },
  { label: "YouTube", value: "youtube" },
  { label: "Twitter", value: "twitter" },
];

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function loadPosts() {
  try {
    return JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
  } catch {
    return [];
  }
}
function savePosts(posts) {
  localStorage.setItem('scheduledPosts', JSON.stringify(posts));
}

export default function Schedule() {
  // Post creation state
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [image, setImage] = useState("");
  const [viewCount, setViewCount] = useState(1000);
  const [avgViewCount, setAvgViewCount] = useState(1200);
  const [hashtags, setHashtags] = useState([]);
  const [scheduledTime, setScheduledTime] = useState(getToday());
  const [caption, setCaption] = useState("");
  const [emailFeedback, setEmailFeedback] = useState("");
  const [reminderMinutes, setReminderMinutes] = useState(0);

  // Scheduled posts state
  const [posts, setPosts] = useState(loadPosts());
  const [selectedDate, setSelectedDate] = useState(getToday());

  useEffect(() => { 
    savePosts(posts); 
    // Dispatch storage event to notify sidebar about post changes
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'scheduledPosts',
      newValue: JSON.stringify(posts),
      oldValue: JSON.stringify(loadPosts())
    }));
  }, [posts]);

  // Calendar helpers
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
  const postsByDate = posts.reduce((acc, p) => {
    acc[p.scheduledTime] = acc[p.scheduledTime] || [];
    acc[p.scheduledTime].push(p);
    return acc;
  }, {});

  // Check login status
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('user.email') : null;
  const userFullName = typeof window !== 'undefined' ? localStorage.getItem('user.fullName') || localStorage.getItem('user.username') : null;

  // Schedule a post
  const handleSchedule = async () => {
    if (!content.trim()) return alert('Content required!');
    const newPost = {
      id: Date.now(),
      content,
      platform,
      image,
      viewCount,
      avgViewCount,
      hashtags,
      scheduledTime,
      caption,
    };
    setPosts([...posts, newPost]);
    setContent("");
    setImage("");
    setHashtags([]);
    setCaption("");
    setViewCount(1000);
    setAvgViewCount(1200);
    setScheduledTime(getToday());
    setReminderMinutes(0);
    // Email notification logic
    setEmailFeedback("");
    if (userEmail) {
      try {
        const res = await fetch(`${API_BASE_URL}/notifyEmail`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            content,
            platform,
            time: scheduledTime,
            reminderMinutes
          })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setEmailFeedback("Email reminder set");
        } else {
          setEmailFeedback(data.error || "Failed to set email reminder");
        }
      } catch {
        setEmailFeedback("Failed to set email reminder");
      }
    }
  };

  // Filter posts by selected date
  const filteredPosts = posts.filter(p => p.scheduledTime === selectedDate);

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar removed here */}
      {/* Content Area */}
      <div style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
        <h1 className="title">Schedule Posts</h1>
        {/* Email notification login banner */}
        {!userEmail && (
          <div style={{ background: '#ffe6e6', color: '#a00', padding: '12px 18px', borderRadius: 8, marginBottom: 18, fontWeight: 500 }}>
            <span role="img" aria-label="lock">🔒</span> Login to enable email notifications for your scheduled posts.
          </div>
        )}
        {/* Post Creation Form */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: 24, marginBottom: 32 }}>
          {/* Email feedback */}
          {emailFeedback && <div style={{ color: '#007a00', marginBottom: 10 }}>{emailFeedback}</div>}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <select 
              value={platform} 
              onChange={e => setPlatform(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}
              title="Select the social media platform for your post"
            >
              <option value="" disabled>Select Platform</option>
              {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <input
              type="text"
              placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
              value={image}
              onChange={e => setImage(e.target.value)}
              style={{ flex: 1, minWidth: 180 }}
            />
            <input
              type="number"
              placeholder="Enter current view count (e.g., 1000)"
              value={viewCount}
              onChange={e => setViewCount(Number(e.target.value))}
              style={{ width: 140 }}
            />
            <input
              type="number"
              placeholder="Enter average view count (e.g., 1200)"
              value={avgViewCount}
              onChange={e => setAvgViewCount(Number(e.target.value))}
              style={{ width: 140 }}
            />
            <input
              type="date"
              value={scheduledTime}
              onChange={e => setScheduledTime(e.target.value)}
              style={{ width: 160 }}
              title="Select the date to schedule your post"
            />
            <input
              type="number"
              min="0"
              max="1440"
              value={reminderMinutes}
              onChange={e => setReminderMinutes(Number(e.target.value))}
              style={{ width: 120 }}
              placeholder="Reminder minutes (e.g., 30)"
              title="Remind me this many minutes before scheduled time"
            />
            <button onClick={handleSchedule} className="schedule-post-btn"> Schedule Post</button>
          </div>
          <textarea
            placeholder="Write your post content here... (e.g., 'Check out this amazing product! 🚀 #innovation #tech')"
            value={content}
            onChange={e => setContent(e.target.value)}
            style={{ width: '100%', marginTop: 12, minHeight: 60, borderRadius: 8, padding: 8 }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 18 }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <HashtagSuggester
                content={content}
                platform={platform}
                audience={"general"}
                onSuggest={res => setHashtags(res?.hashtags || [])}
              />
              <BestTimeRecommender platform={platform} />
              <CaptionGeneratorWrapper content={content} image={image} setCaption={setCaption} />
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <SentimentAnalyzer text={content} />
              <TrendingRecommender platform={platform} viewCount={viewCount} avgViewCount={avgViewCount} />
              <PostPreview content={content} image={image} platform={platform} hashtags={hashtags} />
            </div>
          </div>
        </div>
        <div className="main-content" style={{ display: 'flex', gap: '40px' }}>
          {/* Posts Column */}
          <div className="posts-column" style={{ flex: 1, maxWidth: '500px' }}>
            <h2 style={{ marginBottom: 12 }}>Scheduled Posts ({selectedDate})</h2>
            {filteredPosts.length === 0 && <div style={{ color: '#888' }}>No posts scheduled for this day.</div>}
            {filteredPosts.map(post => (
              <div key={post.id} className={`post-card ${post.platform}`}> 
                <div className="post-header">
                  <img className="icon-img" src={
                    post.platform === 'instagram' ? 'https://img.icons8.com/color/24/instagram-new.png' :
                    post.platform === 'facebook' ? 'https://img.icons8.com/color/24/facebook-new.png' :
                    post.platform === 'youtube' ? 'https://img.icons8.com/color/24/youtube-play.png' :
                    'https://img.icons8.com/color/24/twitter--v1.png'
                  } alt={post.platform} />
                  <span className="time">{post.scheduledTime}</span>
                </div>
                <div className="post-body">
                  <p>{post.content}</p>
                  <ReplySuggestions content={post.content} />
                  <SentimentAnalyzer text={post.content} />
                  <BestTimeRecommender platform={post.platform} />
                  <TrendingRecommender platform={post.platform} viewCount={post.viewCount} avgViewCount={post.avgViewCount} />
                  <div style={{ margin: '8px 0' }}><b>Hashtags:</b> {post.hashtags && post.hashtags.join(' ')}</div>
                  <div style={{ margin: '8px 0' }}><b>Caption:</b> {post.caption}</div>
                  <PostPreview content={post.content} image={post.image} platform={post.platform} hashtags={post.hashtags} />
                </div>
                <div className="post-footer">
                  <span className="badge scheduled">Scheduled</span>
                </div>
              </div>
            ))}
          </div>
          {/* Calendar Column */}
          <div className="calendar-column" style={{ width: '400px', minWidth: '350px', flexShrink: 0 }}>
            <div className="calendar">
              <div className="calendar-header">
                <span className="month">{today.toLocaleString('default', { month: 'long' })} {year}</span>
              </div>
              <div className="calendar-weekdays">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              <div className="calendar-days" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {days.map(day => {
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const postsForDay = postsByDate[dateStr] || [];
                  let bgColor = undefined;
                  let tooltip = undefined;
                  if (postsForDay.length > 0) {
                    // Use the first post's platform for color
                    const platform = postsForDay[0].platform;
                    if (platform === 'instagram') bgColor = '#a18aff';
                    else if (platform === 'facebook') bgColor = '#1877f2';
                    else if (platform === 'youtube') bgColor = '#ff0000';
                    else if (platform === 'twitter') bgColor = '#1da1f2';
                    // Tooltip: show all post titles/content for the day
                    tooltip = postsForDay.map(p => p.content?.slice(0, 40) || 'Post').join('\n');
                  }
                  return (
                    <span
                      key={day}
                      className={
                        'calendar-day' +
                        (dateStr === selectedDate ? ' highlight' : '') +
                        (postsForDay.length > 0 ? ' has-post' : '')
                      }
                      style={{
                        cursor: 'pointer',
                        background: dateStr === selectedDate ? '#a18aff' : bgColor,
                        color: dateStr === selectedDate || bgColor ? '#fff' : undefined
                      }}
                      title={tooltip}
                      onClick={() => setSelectedDate(dateStr)}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaptionGeneratorWrapper({ content, image, setCaption }) {
  const [aiCaption, setAiCaption] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setAiCaption("");
    try {
      const { generateCaptionAI } = await import("../utils/captionGen");
      const keywords = content.split(/\s+/).filter(Boolean).slice(0, 5); // up to 5 keywords
      const result = await generateCaptionAI({ filename: image, keywords });
      setAiCaption(result);
    } catch (e) {
      setError("Failed to generate caption.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div style={{ margin: '16px 0', padding: 12, background: '#f8fafc', borderRadius: 10, boxShadow: '0 1px 4px #eee' }}>
      <div style={{ fontWeight: 600, color: '#7d4cff', marginBottom: 6 }}>AI Caption Generator</div>
      <button onClick={handleGenerate} disabled={loading} style={{ background: '#7d4cff', color: 'white', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 8 }}>
        {loading ? 'Generating...' : 'Generate Caption'}
      </button>
      {error && <div style={{ color: 'red', marginBottom: 6 }}>{error}</div>}
      {aiCaption && (
        <div style={{ marginTop: 6 }}>
          <textarea value={aiCaption} readOnly rows={2} style={{ width: '100%', borderRadius: 6, border: '1px solid #ddd', padding: 6, fontStyle: 'italic', background: '#f4f4ff', color: '#333', resize: 'none' }} />
          <button onClick={() => setCaption(aiCaption)} style={{ marginTop: 6, background: '#22c55e', color: 'white', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 600, cursor: 'pointer' }}>Insert Caption</button>
        </div>
      )}
    </div>
  );
}
