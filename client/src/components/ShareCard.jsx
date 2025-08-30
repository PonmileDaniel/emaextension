import React from 'react';
import { Share, Heart } from 'lucide-react';
import './ShareCard.css';

const ShareCard = ({ profileData, auditResults, onShare }) => {
  return (
    <div className="share-card-container">
      <div className="share-card">
        <div className="card-header">
          <div className="card-profile">
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="card-avatar"
            />
            <div className="card-profile-info">
              <div className="card-name">{profileData.name}</div>
              <div className="card-handle">{profileData.handle}</div>
            </div>
          </div>
          <div className="card-score-section">
            <div className="card-score">{auditResults.score}/{auditResults.maxScore}</div>
            <div className="card-description">"{auditResults.description.substring(0, 80)}..."</div>
          </div>
        </div>
        <div className="card-footer">
          <span>Audited by</span>
          <span className="card-brand">Ema</span>
          <Heart className="card-heart" />
        </div>
        <div className="card-action">
          <button
            onClick={onShare}
            className="share-button"
          >
            <Share className="share-icon" />
            Share on X
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareCard;
