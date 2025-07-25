import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    fullName: "",
    mobileNumber: "",
    bio: "",
    profilePhoto: "",
    profession: "",
    instagram: "",
    facebook: "",
    twitter: "",
    youtube: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userEmail = localStorage.getItem("user.email");

  useEffect(() => {
    if (userEmail) {
      loadProfile();
    }
  }, [userEmail]);

  // Update localStorage with username and profilePhoto after profile fetch
  useEffect(() => {
    if (profile.username) {
      localStorage.setItem("user.username", profile.username);
    }
    if (profile.profilePhoto) {
      localStorage.setItem("user.profilePhoto", profile.profilePhoto);
    }
  }, [profile.username, profile.profilePhoto]);

  const loadProfile = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile?email=${userEmail}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        setError("Failed to load profile");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          fullName: profile.fullName,
          mobileNumber: profile.mobileNumber,
          bio: profile.bio,
          profession: profile.profession,
          instagram: profile.instagram,
          facebook: profile.facebook,
          twitter: profile.twitter,
          youtube: profile.youtube
        })
      });
      
      if (res.ok) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        // Update localStorage with new fullName and username
        if (profile.username) {
          localStorage.setItem("user.username", profile.username);
        }
        if (profile.fullName) {
          localStorage.setItem("user.fullName", profile.fullName);
        }
        // Optionally update profilePhoto if changed
        if (profile.profilePhoto) {
          localStorage.setItem("user.profilePhoto", profile.profilePhoto);
        }
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update profile");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Convert to base64 for demo (in production, use proper file upload)
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Photo = e.target.result;
      
      try {
        const res = await fetch(`${API_BASE_URL}/api/profile/photo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail,
            profilePhoto: base64Photo
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          setProfile(prev => ({ ...prev, profilePhoto: data.profilePhoto }));
          setSuccess("Profile photo updated!");
          // Update localStorage with new profile photo
          if (data.profilePhoto) {
            localStorage.setItem("user.profilePhoto", data.profilePhoto);
          }
        } else {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Failed to update profile photo");
        }
      } catch (err) {
        setError("Network error");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
        <button 
          className="profile-edit-btn"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {error && <div className="profile-error">{error}</div>}
      {success && <div className="profile-success">{success}</div>}

      <div className="profile-content">
        <div className="profile-photo-section">
          <div className="profile-photo">
            {profile.profilePhoto ? (
              <img 
                src={profile.profilePhoto} 
                alt="Profile" 
              />
            ) : (
              <div className="profile-photo-placeholder">
                {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            {isEditing && (
              <div className="photo-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="upload-btn">
                  Change Photo
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-field">
            <label>Username</label>
            <input
              type="text"
              value={profile.username}
              disabled
              className="profile-input disabled"
            />
          </div>

          <div className="profile-field">
            <label>Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="profile-input disabled"
            />
          </div>

          <div className="profile-field">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`profile-input ${!isEditing ? 'disabled' : ''}`}
            />
          </div>

          <div className="profile-field">
            <label>Mobile Number</label>
            <input
              type="tel"
              name="mobileNumber"
              value={profile.mobileNumber}
              onChange={handleChange}
              disabled={!isEditing}
              className={`profile-input ${!isEditing ? 'disabled' : ''}`}
            />
          </div>

          <div className="profile-field">
            <label>Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              disabled={!isEditing}
              className={`profile-textarea ${!isEditing ? 'disabled' : ''}`}
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="profile-field">
            <label>Profession</label>
            <input
              type="text"
              name="profession"
              value={profile.profession}
              onChange={handleChange}
              disabled={!isEditing}
              className={`profile-input ${!isEditing ? 'disabled' : ''}`}
            />
          </div>

          <div className="profile-field">
            <label>Social Media Links</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                type="url"
                name="instagram"
                placeholder="Instagram URL"
                value={profile.instagram}
                onChange={handleChange}
                disabled={!isEditing}
                className={`profile-input ${!isEditing ? 'disabled' : ''}`}
              />
              <input
                type="url"
                name="facebook"
                placeholder="Facebook URL"
                value={profile.facebook}
                onChange={handleChange}
                disabled={!isEditing}
                className={`profile-input ${!isEditing ? 'disabled' : ''}`}
              />
              <input
                type="url"
                name="twitter"
                placeholder="Twitter URL"
                value={profile.twitter}
                onChange={handleChange}
                disabled={!isEditing}
                className={`profile-input ${!isEditing ? 'disabled' : ''}`}
              />
              <input
                type="url"
                name="youtube"
                placeholder="YouTube URL"
                value={profile.youtube}
                onChange={handleChange}
                disabled={!isEditing}
                className={`profile-input ${!isEditing ? 'disabled' : ''}`}
              />
            </div>
            {/* Show links if not editing */}
            {!isEditing && (
              <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {profile.instagram && <a href={profile.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#dd2a7b' }}>Instagram</a>}
                {profile.facebook && <a href={profile.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#1877F3' }}>Facebook</a>}
                {profile.twitter && <a href={profile.twitter} target="_blank" rel="noopener noreferrer" style={{ color: '#1DA1F2' }}>Twitter</a>}
                {profile.youtube && <a href={profile.youtube} target="_blank" rel="noopener noreferrer" style={{ color: '#FF0000' }}>YouTube</a>}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button 
                className="profile-save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 