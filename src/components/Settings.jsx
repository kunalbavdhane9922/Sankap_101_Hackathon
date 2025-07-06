import React, { useEffect, useState } from 'react';
import SentimentAnalyzer from './SentimentAnalyzer';
import '../pages/Home.css';
import API_BASE_URL from "../config";

export default function Settings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prefs, setPrefs] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${API_BASE_URL}/settings`)
      .then(res => res.json())
      .then(d => { 
        setData(d); 
        setPrefs(d.preferences);
        
        // Sync theme preference with dark mode toggle
        const darkMode = localStorage.getItem('darkMode') === 'true';
        const theme = darkMode ? 'dark' : 'light';
        if (d.preferences.theme !== theme) {
          setPrefs(prev => ({ ...prev, theme }));
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setPrefs({ ...prefs, [name]: newValue });
    
    // If theme is changed, update dark mode toggle
    if (name === 'theme') {
      const isDark = newValue === 'dark';
      localStorage.setItem('darkMode', isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
      
      // Dispatch storage event to notify other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'darkMode',
        newValue: isDark.toString(),
        oldValue: (!isDark).toString()
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences: prefs })
      });
      if (!res.ok) throw new Error('Failed to save preferences');
      const d = await res.json();
      setData(d);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-main">
      <div className="dashboard-section">
        <h1>Settings</h1>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {prefs && (
          <div style={{ marginBottom: 24 }}>
            <b>User Preferences:</b>
            <div style={{ margin: '12px 0' }}>
              <label>Niche: <input name="niche" value={prefs.niche} onChange={handleChange} /></label>
            </div>
            <div style={{ margin: '12px 0' }}>
              <label>Notifications: <input name="notifications" type="checkbox" checked={prefs.notifications} onChange={handleChange} /></label>
            </div>
            <div style={{ margin: '12px 0' }}>
              <label>Theme: 
                <select name="theme" value={prefs.theme} onChange={handleChange}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
            </div>
            <button className="add-account-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Preferences'}</button>
          </div>
        )}
        {data && (
          <div style={{ marginBottom: 18 }}>
            <b>AI Recommendations:</b>
            <ul>
              {data.aiRecommendations.map((rec, i) => (
                <li key={i}>
                  {rec}
                  <SentimentAnalyzer text={rec} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 