import { NavLink, useNavigate } from "react-router-dom";
import React from "react";
function Slidebar(){
    const navigate = useNavigate();
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('user.email') : null;
    const handleLogout = () => {
      localStorage.removeItem('user.email');
      window.location.reload();
    };
    return(
        <div className="sidebar">
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#7d4cff' }}>Social Platform</h1>
        <nav>
          <NavLink to="/" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'} end>Home</NavLink>
          <NavLink to="/schedule" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Schedule Posts</NavLink>
          <NavLink to="/users" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Social Media Accounts</NavLink>
          <NavLink to="/income" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Income</NavLink>
          <NavLink to="/billing" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Billing</NavLink>
          <NavLink to="/settings" className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}>Settings</NavLink>
        </nav>
        <div style={{ marginTop: '30px' }}>
          <h4 style={{ color: '#555', marginBottom: '10px' }}>Scheduled Events</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#666' }}>
            <li><span style={{ color: '#2196f3' }}>●</span> Hubby Bday</li>
            <li><span style={{ color: '#9c27b0' }}>●</span> Sis Anniversary</li>
            <li><span style={{ color: '#4caf50' }}>●</span> Bestie Wedding</li>
          </ul>
        </div>
        <div style={{ marginTop: 'auto', fontSize: '14px', color: '#888' }}>
          {userEmail ? (
            <>
              <div style={{ marginBottom: 8 }}>Logged in as <b>{userEmail}</b></div>
              <button onClick={handleLogout} style={{ padding: '6px 18px', borderRadius: 8, background: '#eee', color: '#a00', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <button onClick={() => navigate('/login')} style={{ padding: '6px 18px', borderRadius: 8, background: '#7d4cff', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Login</button>
          )}
        </div>
      </div>
    )
}

export default Slidebar;