import React, { useState, useEffect } from 'react';
import './Users.css';

const PLATFORMS = [
  { name: 'Instagram', icon: 'https://img.icons8.com/color/24/instagram-new.png', key: 'instagram' },
  { name: 'Facebook', icon: 'https://img.icons8.com/color/24/facebook-new.png', key: 'facebook' },
  { name: 'YouTube', icon: 'https://img.icons8.com/color/24/youtube-play.png', key: 'youtube' },
  { name: 'X (Twitter)', icon: 'https://img.icons8.com/color/24/twitter--v1.png', key: 'twitter' },
];

function AccountItem({ account, onRemove }) {
  return (
    <tr>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={account.avatar} alt={account.name} className="users-avatar" />
          <span className="users-name">{account.name}</span>
        </div>
      </td>
      <td>{account.followers?.toLocaleString?.() ?? account.followers}</td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={account.platformIcon} alt={account.platform} className="users-platform-icon" />
          {account.platform}
        </div>
      </td>
      <td>
        <span className={`users-status users-status-${account.status?.toLowerCase?.() || 'active'}`}> 
          <span className={`users-status-dot users-status-${account.status?.toLowerCase?.() || 'active'}`}>●</span>
          {account.status || 'Active'}
        </span>
      </td>
      <td>
        <button className="remove-account-btn" onClick={() => onRemove(account._id)}>Remove</button>
      </td>
    </tr>
  );
}

const fetchAccountDetails = async (platform) => {
  // Use the same mock endpoints for demo, or replace with real fetch if needed
  const endpoint = `http://localhost:5000/${platform}`;
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error('Failed to fetch account details');
  return res.json();
};

const Users = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState([]);

  // Fetch accounts from backend
  const loadAccounts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/accounts');
      const data = await res.json();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load accounts');
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleAddAccount = async (platformKey) => {
    setSelectedPlatform(platformKey);
    setLoading(true);
    setError('');
    setShowModal(false);
    try {
      const details = await fetchAccountDetails(platformKey);
      // POST to backend
      const res = await fetch('http://localhost:5000/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      if (!res.ok) throw new Error('Failed to add account');
      await loadAccounts();
    } catch (err) {
      setError(err.message || 'Failed to add account');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAccount = async (id) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/accounts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to remove account');
      await loadAccounts();
    } catch (err) {
      setError(err.message || 'Failed to remove account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="users-table-container">
      <button className="add-account-btn" onClick={() => setShowModal(true)}>
        + Add Account
      </button>
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Select a platform</h3>
            <ul className="platform-list">
              {PLATFORMS.map((p) => (
                <li key={p.key} onClick={() => handleAddAccount(p.key)} className="platform-option">
                  <img src={p.icon} alt={p.name} className="users-platform-icon" /> {p.name}
                </li>
              ))}
            </ul>
            <button className="close-modal-btn" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
      {loading && <div className="loading-spinner">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      <table className="users-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Followers</th>
            <th>Platform</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.length === 0 && (
            <tr><td colSpan={4} style={{ textAlign: 'center', color: '#888' }}>No accounts added yet. Click "Add Account" to get started.</td></tr>
          )}
          {accounts.map((account, idx) => (
            <AccountItem key={account._id || account.platform + idx} account={account} onRemove={handleRemoveAccount} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;