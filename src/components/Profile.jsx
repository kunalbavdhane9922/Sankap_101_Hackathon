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
    profilePhoto: ""
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
          bio: profile.bio
        })
      });
      
      if (res.ok) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
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
        } else {
          setError("Failed to update profile photo");
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
            <img 
              src={profile.profilePhoto || "https://i.pravatar.cc/150"} 
              alt="Profile" 
            />
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