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
    if (typeof window !== 'undefined') {
      setUserData({
        email: localStorage.getItem('user.email'),
        fullName: localStorage.getItem('user.fullName') || localStorage.getItem('user.username'),
        profilePhoto: localStorage.getItem('user.profilePhoto') || ''
      });

      const posts = JSON.parse(localStorage.getItem('user.posts') || '[]');
      setUserPosts(posts);

      const darkPref = localStorage.getItem('darkMode') === 'true';
      setDarkMode(darkPref);
      document.body.classList.toggle('dark', darkPref);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user.email');
    window.location.reload();
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    document.body.classList.toggle('dark', newMode);
  };

  return (
    <div className={`sidebar ${darkMode ? 'dark' : ''}`}>
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
        <h4 className="section-title">Your Recent Posts</h4>
        <ul className="posts-list">
          {userPosts.length > 0 ? (
            userPosts.slice(0, 3).map((post, index) => (
              <li key={index}>{post.title || post.content?.substring(0, 30)}...</li>
            ))
          ) : (
            <li>No posts yet.</li>
          )}
        </ul>
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
