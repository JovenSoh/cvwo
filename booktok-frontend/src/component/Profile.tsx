import React, { useState, useEffect } from 'react';
import './Profile.css';

interface ProfileProps {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
}
  
const Profile: React.FC<ProfileProps> = ({ username, setUsername }) => {  
  const [profile, setProfile] = useState({
    username: username,
    name: '',
    bio: '',
    birthday: ''
  });
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message: string, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000); // hide after 3 seconds
  };

  useEffect(() => {
    // Load profile data from local storage
    const savedProfile = localStorage.getItem('profile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setUsername(profile.username);
    showToast('Update successful!');
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            name="username" 
            value={profile.username} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            name="name" 
            value={profile.name} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea 
            name="bio" 
            value={profile.bio} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label>Birthday</label>
          <input 
            type="date" 
            name="birthday" 
            value={profile.birthday} 
            onChange={handleChange} 
          />
        </div>
        <button type="submit" className="submit-button">Update Profile</button>
      </form>
      {toast.message && (
        <div className={`toast-message ${toast.type === 'error' ? 'error' : ''}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Profile;
