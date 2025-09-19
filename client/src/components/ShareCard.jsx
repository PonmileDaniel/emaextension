import React, { useRef } from 'react';
import { Share, Heart, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import './ShareCard.css';

const ShareCard = ({ profileData, auditResults, onShare }) => {
  const cardRef = useRef(null);

  // Create the personalized share text
  const createShareText = () => {
    const shareMessage = auditResults.shareMessage;
    const baseText = `Just got my X profile audited by @emaaudit ! ${shareMessage?.emoji || '🚀'}\n\n`;
    const personalMessage = `"${shareMessage?.text || 'Great potential for growth'}" - Ema AI\n\n`;
    const scoreText = `Score: ${auditResults.score}/${auditResults.maxScore} ✨\n\n`;
    const ctaText = `Get your free audit too! 👆`;
    
    return baseText + personalMessage + scoreText + ctaText;
  };

  const generateAndShareImage = async () => {
    if (!cardRef.current) {
      console.error("Share card element not found.");
      return;
    }

    try {
      // Generate canvas from the card element
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true, // Important for loading the external profile image
        scale: 2,      // Generate a higher resolution image
        backgroundColor: null // Use the component's background
      });

      // Convert canvas to a blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          console.error("Failed to create image blob.");
          return;
        }

        const file = new File([blob], "ema-audit.png", { type: "image/png" });
        const shareData = {
          text: createShareText(),
          files: [file],
        };

        // Use Web Share API if available (mostly on mobile)
        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          // Fallback for desktop: download the image and open Twitter
          alert("Your shareable card image will be downloaded. Please attach it to your tweet!");
          
          // Trigger download
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = 'ema-audit.png';
          link.click();

          // Open Twitter compose window
          const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(createShareText())}`;
          window.open(tweetUrl, '_blank');
        }
      }, 'image/png');

    } catch (error) {
      console.error("Error generating or sharing image:", error);
      alert("Could not generate shareable image. Sharing text only.");
      // Fallback to text-only share on error
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(createShareText())}`;
      window.open(tweetUrl, '_blank');
    }

    if (onShare) onShare();
  };

  return (
    <div className="share-card-container">
      <div ref={cardRef} className="share-card">
        <div className="card-header">
          <div className="card-profile">
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="card-avatar"
              crossOrigin="anonymous" // Required for html2canvas to capture the image
            />
            <div className="card-profile-info">
              <div className="card-name">{profileData.name}</div>
              <div className="card-handle">{profileData.handle}</div>
            </div>
          </div>
          <div className="card-score-section">
            <div className="card-score">{auditResults.score}/{auditResults.maxScore}</div>
            {auditResults.shareMessage && (
              <div className="card-personal-message">
                <Sparkles className="card-sparkles" />
                <span className="personal-message-text">
                  "{auditResults.shareMessage.text}" {auditResults.shareMessage.emoji}
                </span>
              </div>
            )}
            <div className="card-vibe-tag">
              {auditResults.shareMessage?.vibe || 'unique'} creator
            </div>
          </div>
        </div>
        <div className="card-footer">
          <span>Audited by </span>
          <span className="card-brand">Ema</span>
          <Heart className="card-heart" />
        </div>
      </div>
      <div className="card-action">
        <button
          onClick={generateAndShareImage} // Use the new image generation function
          className="share-button"
        >
          <Share className="share-icon" />
          Share on X
        </button>
      </div>
    </div>
  );
};

export default ShareCard;
