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
    profession: "",
    profilePhoto: "",
    social: {
      instagram: "",
      youtube: "",
      facebook: "",
      twitter: ""
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userEmail = localStorage.getItem("user.email");

  useEffect(() => {
    if (userEmail) loadProfile();
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
        body: JSON.stringify({ email: userEmail, ...profile })
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
          setProfile((prev) => ({ ...prev, profilePhoto: data.profilePhoto }));
          setSuccess("Profile photo updated!");
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
    const { name, value } = e.target;
    if (["instagram", "youtube", "facebook", "twitter"].includes(name)) {
      setProfile((prev) => ({
        ...prev,
        social: {
          ...prev.social,
          [name]: value
        }
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const professions = [
    "Student", "Engineer", "Designer", "Developer", "Artist", "Writer", "Entrepreneur", "Other"
  ];

  if (loading) return <div className="profile-loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
        <button className="profile-edit-btn" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {error && <div className="profile-error">{error}</div>}
      {success && <div className="profile-success">{success}</div>}

      <div className="profile-content">
        <div className="profile-photo-section">
          <div className="profile-photo">
            {profile.profilePhoto ? (
              <img src={profile.profilePhoto} alt="Profile" />
            ) : (
              <div className="profile-photo-placeholder">
                {profile.fullName?.charAt(0).toUpperCase() || profile.username?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            {isEditing && (
              <div className="photo-upload">
                <input type="file" accept="image/*" onChange={handlePhotoUpload} id="photo-upload" />
                <label htmlFor="photo-upload" className="upload-btn">Change Photo</label>
              </div>
            )}
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-field">
            <label>Username</label>
            <input type="text" value={profile.username} disabled className="profile-input disabled" />
          </div>

          <div className="profile-field">
            <label>Email</label>
            <input type="email" value={profile.email} disabled className="profile-input disabled" />
          </div>

          <div className="profile-field">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`profile-input ${!isEditing ? "disabled" : ""}`}
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
              className={`profile-input ${!isEditing ? "disabled" : ""}`}
            />
          </div>

          <div className="profile-field">
            <label>Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              disabled={!isEditing}
              className={`profile-textarea ${!isEditing ? "disabled" : ""}`}
              rows="4"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="profile-field">
            <label>Profession</label>
            <select
              name="profession"
              value={profile.profession}
              onChange={handleChange}
              disabled={!isEditing}
              className={`profile-input ${!isEditing ? "disabled" : ""}`}
            >
              <option value="">Select Profession</option>
              {professions.map((prof) => (
                <option key={prof} value={prof}>{prof}</option>
              ))}
            </select>
          </div>

          <div className="profile-field">
            <label>Instagram</label>
            <input
              type="url"
              name="instagram"
              value={profile.social.instagram}
              onChange={handleChange}
              disabled={!isEditing}
              className={`profile-input ${!isEditing ? "disabled" : ""}`}
              placeholder="https://instagram.com/username"
            />
          </div>

          <div className="profile-field">
            <label>YouTube</label>
            <input
              type="url"
              name="youtube"
              value={profile.social.youtube}
              onChange={handleChange}
              disabled={!isEditing}
              className={`profile-input ${!isEditing ? "disabled" : ""}`}
              placeholder="https://youtube.com/channel/xyz"
            />
          </div>

          <div className="profile-field">
            <label>Facebook</label>
            <input
              type="url"
              name="facebook"
              value={profile.social.facebook}
              onChange={handleChange}
              disabled={!isEditing}
              className={`profile-input ${!isEditing ? "disabled" : ""}`}
              placeholder="https://facebook.com/username"
            />
          </div>

          <div className="profile-field">
            <label>Twitter</label>
            <input
              type="url"
              name="twitter"
              value={profile.social.twitter}
              onChange={handleChange}
              disabled={!isEditing}
              className={`profile-input ${!isEditing ? "disabled" : ""}`}
              placeholder="https://twitter.com/username"
            />
          </div>

          {isEditing && (
            <div className="profile-actions">
              <button className="profile-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
