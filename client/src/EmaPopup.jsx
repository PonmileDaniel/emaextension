import React, { useState, useEffect } from 'react';
import { Play, Loader2 } from 'lucide-react';
import Header from './components/Header';
import ProfilePreview from './components/ProfilePreview';
import AuditScore from './components/AuditScore';
import AuditSection from './components/AuditSection';
import ShareCard from './components/ShareCard';
import Footer from './components/Footer';
import './EmaPopup.css';

const EmaPopup = () => {
  const [currentState, setCurrentState] = useState('initial');
  const [expandedSection, setExpandedSection] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [auditResults, setAuditResults] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Load profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // First, try to get stored profile data
        const result = await chrome.storage.local.get(['latestProfile', 'profileAvailable']);
        
        if (result.latestProfile && result.profileAvailable) {
          setProfileData(result.latestProfile);
          setIsLoadingProfile(false);
          return;
        }

        // If no stored data, try to extract from current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab && (tab.url.includes('twitter.com') || tab.url.includes('x.com'))) {
          // Send message to content script to extract data
          const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PROFILE_DATA' });
          
          if (response?.success && response.data) {
            setProfileData(response.data);
            // Store for future use
            await chrome.storage.local.set({
              latestProfile: response.data,
              profileAvailable: true
            });
          }
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfileData();
  }, []);

  const handleRunAudit = async () => {
    if (!profileData) {
      alert('No profile data available. Please visit an X/Twitter profile first.');
      return;
    }

    setCurrentState('loading');
    
    // Simulate API call to audit service
    setTimeout(() => {
      // Mock audit results - replace with actual API call
      const mockResults = {
        score: 7,
        maxScore: 10,
        description: 'Good profile with room for improvement in engagement and content strategy.',
        doingRight: [
          'Clear profile information and bio',
          'Regular posting activity',
          'Engaging with followers'
        ],
        doingWrong: [
          'Inconsistent posting schedule',
          'Limited use of hashtags',
          'Low engagement rate'
        ],
        shouldStart: [
          'Create a content calendar',
          'Use more relevant hashtags',
          'Engage more with your community',
          'Share more visual content'
        ]
      };
      
      setAuditResults(mockResults);
      setCurrentState('results');
    }, 3000);
  };

  const handleShareCard = () => {
    if (!auditResults) return;
    
    const tweetText = `Just got my X profile audited by @EmaAudit! 🚀\n\nScore: ${auditResults.score}/${auditResults.maxScore}\n"${auditResults.description.substring(0, 100)}..."\n\nTry it yourself!`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="ema-popup">
      <Header />
      
      <div className="popup-content">
        {currentState === 'initial' && (
          <>
            {isLoadingProfile ? (
              <div className="loading-state">
                <div className="loading-content">
                  <Loader2 className="loading-spinner" />
                  <span className="loading-text">Loading profile...</span>
                </div>
              </div>
            ) : (
              <>
                {profileData ? (
                  <ProfilePreview profileData={profileData} />
                ) : (
                  <div className="no-profile-state">
                    <p className="no-profile-message">
                      No X profile detected. Please visit an X/Twitter profile page to get started.
                    </p>
                  </div>
                )}
                <div className="initial-actions">
                  <button
                    onClick={handleRunAudit}
                    className="run-audit-button"
                    disabled={!profileData}
                  >
                    <Play className="button-icon" />
                    Run Audit
                  </button>
                  <p className="audit-description">
                    {profileData 
                      ? "Get AI-powered insights on this X profile"
                      : "Visit an X profile to start auditing"
                    }
                  </p>
                </div>
              </>
            )}
          </>
        )}

        {currentState === 'loading' && (
          <div className="loading-state">
            <div className="loading-content">
              <Loader2 className="loading-spinner" />
              <span className="loading-text">Auditing profile...</span>
            </div>
            <p className="loading-description">
              Analyzing tweets, engagement, and profile optimization
            </p>
          </div>
        )}

        {currentState === 'results' && profileData && auditResults && (
          <div className="results-state">
            <ProfilePreview profileData={profileData} isCompact={true} />
            
            <AuditScore 
              score={auditResults.score}
              maxScore={auditResults.maxScore}
              description={auditResults.description}
            />

            <div className="audit-sections">
              <AuditSection
                type="right"
                title="What You're Doing Well"
                items={auditResults.doingRight}
                isExpanded={expandedSection === 'right'}
                onToggle={() => toggleSection('right')}
              />
              
              <AuditSection
                type="wrong"
                title="Areas for Improvement"
                items={auditResults.doingWrong}
                isExpanded={expandedSection === 'wrong'}
                onToggle={() => toggleSection('wrong')}
              />
              
              <AuditSection
                type="start"
                title="Growth Recommendations"
                items={auditResults.shouldStart}
                isExpanded={expandedSection === 'start'}
                onToggle={() => toggleSection('start')}
              />
            </div>

            <ShareCard 
              profileData={profileData}
              auditResults={auditResults}
              onShare={handleShareCard}
            />

            <Footer />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmaPopup;