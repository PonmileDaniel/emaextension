import React from 'react';
import './ProfilePreview.css';

const ProfilePreview = ({ profileData, isCompact = false }) => {
  return (
    <div className={`profile-preview ${isCompact ? 'profile-compact' : ''}`}>
      <div className="profile-content">
        <img
          src={profileData.avatar}
          alt={profileData.name}
          className={`profile-avatar ${isCompact ? 'avatar-small' : ''}`}
        />
        <div className="profile-info">
          <h2 className="profile-name">{profileData.name}</h2>
          <p className="profile-handle">{profileData.handle}</p>
          {!isCompact && (
            <>
              <p className="profile-bio">{profileData.bio}</p>
              <div className="profile-stats">
                <span>
                  <span className="stat-number">{profileData.followers}</span> followers
                </span>
                <span>
                  <span className="stat-number">{profileData.following}</span> following
                </span>
              </div>
            </>
          )}
          {isCompact && (
            <>
              <p className="profile-bio-compact">{profileData.bio}</p>
              <div className="profile-stats-compact">
                <span>
                  <span className="stat-number">{profileData.followers}</span> Followers
                </span>
                <span>
                  <span className="stat-number">{profileData.following}</span> Following
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
