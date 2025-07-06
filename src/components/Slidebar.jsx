import { NavLink, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: '',
    fullName: '',
    profilePhoto: ''
  });
  const [userPosts, setUserPosts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    function updateScheduledPosts() {
      const scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
      const currentUserEmail = localStorage.getItem('user.email');
      
      // Filter posts by current user (if logged in) or show all posts
      let userPosts = scheduledPosts;
      if (currentUserEmail) {
        // For now, show all posts since we don't have user-specific filtering in the Schedule component
        // In a real app, posts would have a userId field
        userPosts = scheduledPosts;
      }
      
      // Sort by scheduled time (earliest first)
      userPosts.sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime));
      setUserPosts(userPosts);
    }

    if (typeof window !== 'undefined') {
      setUserData({
        email: localStorage.getItem('user.email'),
        fullName: localStorage.getItem('user.fullName') || localStorage.getItem('user.username'),
        profilePhoto: localStorage.getItem('user.profilePhoto') || ''
      });

      updateScheduledPosts();

      const darkPref = localStorage.getItem('darkMode') === 'true';
      setDarkMode(darkPref);
      if (darkPref) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }

      // Listen for changes to scheduledPosts in localStorage
      window.addEventListener('storage', (e) => {
        if (e.key === 'scheduledPosts') {
          updateScheduledPosts();
        }
        // Listen for dark mode changes from other components
        if (e.key === 'darkMode') {
          const newDarkMode = e.newValue === 'true';
          setDarkMode(newDarkMode);
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
          }
        }
      });
    }

    // Also poll for changes every 2 seconds (for same-tab updates)
    const interval = setInterval(updateScheduledPosts, 2000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to get upcoming posts (today and tomorrow)
  const getUpcomingPosts = () => {
    const today = new Date().toDateString();
    const tomorrow = new Date(Date.now() + 86400000).toDateString();
    
    return userPosts.filter(post => {
      const postDate = new Date(post.scheduledTime).toDateString();
      return postDate === today || postDate === tomorrow;
    });
  };

  const upcomingPosts = getUpcomingPosts();

  // Helper function to get posts by platform
  const getPostsByPlatform = () => {
    const platformCounts = {};
    userPosts.forEach(post => {
      platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
    });
    return platformCounts;
  };

  const platformCounts = getPostsByPlatform();

  const handleLogout = () => {
    localStorage.removeItem('user.email');
    window.location.reload();
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'darkMode',
      newValue: newMode.toString(),
      oldValue: (!newMode).toString()
    }));
  };

  return (
    <div className="sidebar">
      <h1 className="sidebar-title">Social Platform</h1>
      <button onClick={toggleDarkMode} className="dark-toggle">
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <nav>
        <NavLink to="/" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'} end>Home</NavLink>
        <NavLink to="/schedule" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Schedule Posts</NavLink>
        <NavLink to="/users" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Social Media Accounts</NavLink>
        <NavLink to="/income" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Income</NavLink>
        <NavLink to="/billing" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Billing</NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Settings</NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Profile</NavLink>
      </nav>

      <div style={{ marginTop: '30px' }}>
        <h4 className="section-title">
          Scheduled Posts {userPosts.length > 0 && `(${userPosts.length})`}
        </h4>
        
        {/* Platform summary */}
        {Object.keys(platformCounts).length > 0 && (
          <div className="platform-summary">
            {Object.entries(platformCounts).map(([platform, count]) => {
              const platformIcon = {
                instagram: '📷',
                facebook: '📘',
                youtube: '📺',
                twitter: '🐦'
              }[platform] || '📝';
              
              return (
                <div key={platform} className="platform-item">
                  <span className="platform-icon">{platformIcon}</span>
                  <span className="platform-name">{platform}</span>
                  <span className="platform-count">{count}</span>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Show upcoming posts prominently */}
        {upcomingPosts.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <div className="upcoming-posts-header">🚀 Upcoming ({upcomingPosts.length})</div>
            <ul className="posts-list">
              {upcomingPosts.slice(0, 3).map((post, index) => {
                const platformIcon = {
                  instagram: '📷',
                  facebook: '📘',
                  youtube: '📺',
                  twitter: '🐦'
                }[post.platform] || '📝';
                
                const scheduledDate = new Date(post.scheduledTime);
                const isToday = scheduledDate.toDateString() === new Date().toDateString();
                
                return (
                  <li key={`upcoming-${index}`} className="scheduled-post-item upcoming" onClick={() => navigate('/schedule')}>
                    <div className="post-platform">{platformIcon} {post.platform}</div>
                    <div className="post-content">{post.content?.substring(0, 35)}...</div>
                    <div className="post-date">{isToday ? 'Today' : 'Tomorrow'}</div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
        
        {/* Show all posts */}
        <ul className="posts-list">
          {userPosts.length > 0 ? (
            userPosts.slice(0, 5).map((post, index) => {
              const platformIcon = {
                instagram: '📷',
                facebook: '📘',
                youtube: '📺',
                twitter: '🐦'
              }[post.platform] || '📝';
              
              const scheduledDate = new Date(post.scheduledTime);
              const isToday = scheduledDate.toDateString() === new Date().toDateString();
              const isTomorrow = scheduledDate.toDateString() === new Date(Date.now() + 86400000).toDateString();
              
              let dateDisplay = '';
              if (isToday) {
                dateDisplay = 'Today';
              } else if (isTomorrow) {
                dateDisplay = 'Tomorrow';
              } else {
                dateDisplay = scheduledDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                });
              }
              
              return (
                <li key={index} className="scheduled-post-item" onClick={() => navigate('/schedule')}>
                  <div className="post-platform">{platformIcon} {post.platform}</div>
                  <div className="post-content">{post.content?.substring(0, 40)}...</div>
                  <div className="post-date">{dateDisplay}</div>
                </li>
              );
            })
          ) : (
            <li className="no-posts">No scheduled posts yet.</li>
          )}
        </ul>
        {userPosts.length > 5 && (
          <div className="more-posts" onClick={() => navigate('/schedule')}>
            +{userPosts.length - 5} more posts
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', fontSize: '14px', color: '#888' }}>
        {userData.email ? (
          <>
            <div className="user-info">
              {userData.profilePhoto ? (
                <img src={userData.profilePhoto} alt="Profile" className="profile-pic" />
              ) : (
                <div className="profile-initial">{userData.fullName?.charAt(0).toUpperCase() || 'U'}</div>
              )}
              <div>
                <div style={{ fontWeight: 600 }}>{userData.fullName}</div>
                <div style={{ fontSize: 12 }}>{userData.email}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </>
        ) : (
          <button onClick={() => navigate('/login')} className="login-button">Login</button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;