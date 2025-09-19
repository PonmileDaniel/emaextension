import React, { useState, useEffect } from 'react';
import { Play, Loader2 } from 'lucide-react';
import Header from './components/Header';
import ProfilePreview from './components/ProfilePreview';
import AuditScore from './components/AuditScore';
import AuditSection from './components/AuditSection';
import ShareCard from './components/ShareCard';
import ContentPerformance from './components/ContentPerformance';
import ContentTopics from './components/ContentTopics';
import Footer from './components/Footer';
import './EmaPopup.css';

const EmaPopup = () => {
  const [currentState, setCurrentState] = useState('initial');
  const [extractedTweets, setExtractedTweets] = useState([]);
  const [tweetExtractionStep, setTweetExtractionStep] = useState('idle');
  const [currentTweetCount, setCurrentTweetCount] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [auditResults, setAuditResults] = useState(null);
  const [isPinned, setIsPinned] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [expandedSection, setExpandedSection] = useState(null); // Add missing state

  // Listen for tweet count updates from content script
  useEffect(() => {
    const handleMessage = (message) => {
      if (message.type === 'TWEET_COUNT_UPDATED') {
        setCurrentTweetCount(message.count);
        //console.log(`Real-time tweet count: ${message.count}`);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  // Stop tweet counting when component unmounts or state changes
  useEffect(() => {
    return () => {
      if (tweetExtractionStep === 'instructions') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'STOP_TWEET_COUNTING' });
          }
        });
      }
    };
  }, [tweetExtractionStep]);

  // Load profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Get current tab info
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // First, try to get stored profile data
        const resultExtension = await chrome.storage.local.get(['extensionPinned', 'currentTabId']);
        const isPinnedToCurrentTab = resultExtension.extensionPinned && resultExtension.currentTabId === tab.id;
        setIsPinned(isPinnedToCurrentTab);
        
        // Always try to get fresh profile data from current tab first
        if (tab && (tab.url.includes('twitter.com') || tab.url.includes('x.com'))) {
          try {
            // Send message to content script to extract fresh data
            const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PROFILE_DATA' });
            
            if (response?.success && response.data) {
              setProfileData(response.data);
              setIsLoadingProfile(false);
              //console.log('✅ Profile data loaded:', response.data);
              return;
            }
          } catch (error) {
            console.log('Could not get fresh profile data:', error);
          }
        }

        // Only fallback to cached data if we're not on a profile page
        const result = await chrome.storage.local.get(['latestProfile', 'profileAvailable']);
        if (result.latestProfile && result.profileAvailable) {
          setProfileData(result.latestProfile);
          //console.log('Using cached profile data:', result.latestProfile);
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
    setTweetExtractionStep('instructions');
    
    // Start real-time tweet counting
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('📡 Starting tweet counting on tab:', tab.id);
      const response = await chrome.tabs.sendMessage(tab.id, { type: 'START_TWEET_COUNTING' });
      if (response?.success) {
        setCurrentTweetCount(response.count);
      } else {
        console.error('Failed to start tweet counting:', response);
      }
    } catch (error) {
      console.error('Error starting tweet counting:', error);
    }
  };

  const handleStartTweetExtraction = async () => {
    setTweetExtractionStep('extracting');
    
    try {
      // Stop the real-time counting
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      await chrome.tabs.sendMessage(tab.id, { type: 'STOP_TWEET_COUNTING' });
      
      // Extract tweets from current page
      const response = await chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_TWEETS' });
      
      if (response?.success) {
        setExtractedTweets(response.data);
        
        if (response.count < 10) {
          setTweetExtractionStep('need-more');
          // Restart counting for more tweets
          await chrome.tabs.sendMessage(tab.id, { type: 'START_TWEET_COUNTING' });
        } else {
          setTweetExtractionStep('complete');
          // Proceed with audit analysis
          setTimeout(() => {
            analyzeExtractedData(response.data);
          }, 1000);
        }
      } else {
        setTweetExtractionStep('error');
      }
    } catch (error) {
      setTweetExtractionStep('error');
    }
  };

  // Auto-extract when we have enough tweets
  useEffect(() => {
    if (tweetExtractionStep === 'instructions' && currentTweetCount >= 15) {
      // Auto-proceed when we have enough tweets
      setTimeout(() => {
        handleStartTweetExtraction();
      }, 500); // Small delay to avoid rapid triggering
    }
  }, [currentTweetCount, tweetExtractionStep]);

  const analyzeExtractedData =async (tweets) => {
    try {
      // Send data to the backend for analysis
      const response = await fetch('http://localhost:3001/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profileData,
          tweets
        })
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }
      const data = await response.json();
      if (data.success) {
        setAuditResults(data.results);
        setCurrentState('results');
        return;
      }
      else{
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing tweets:', error);
    }
    
  
  };

  const handleShareCard = () => {
    if (!auditResults) return;
    
    const tweetText = `Just got my X profile audited by @emaaudit! 🚀\n\nScore: ${auditResults.score}/${auditResults.maxScore}\n"${auditResults.description.substring(0, 100)}..."\n\nTry it yourself!`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetUrl, '_blank');
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="ema-popup">
      <Header/>
      
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
            {tweetExtractionStep === 'instructions' && (
              <div className="tweet-instructions">
                <h3>Scanning for Tweets </h3>
                <div className="tweet-counter">
                  <div className="counter-circle">
                    <span className="counter-number">{currentTweetCount}</span>
                    <span className="counter-label">tweets found</span>
                  </div>
                </div>
                <div className="instruction-steps">
                  <p>Keep scrolling to load more tweets for better analysis:</p>
                  <ol>
                    <li>Scroll down to load more recent tweets</li>
                    <li>We'll automatically start analyzing when you have 15+ tweets</li>
                    <li>Target: 15-30 tweets for optimal results</li>
                  </ol>
                </div>
                <div className="progress-indicator">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${Math.min((currentTweetCount / 15) * 100, 100)}%`,
                        backgroundColor: currentTweetCount >= 15 ? '#10b981' : '#3b82f6'
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {currentTweetCount < 15 
                      ? `${15 - currentTweetCount} more tweets needed`
                      : 'Ready for analysis!'
                    }
                  </span>
                </div>
                {currentTweetCount >= 10 && (
                  <button onClick={handleStartTweetExtraction} className="extract-button manual-extract">
                    Analyze Now ({currentTweetCount} tweets)
                  </button>
                )}
              </div>
            )}
            
            {tweetExtractionStep === 'extracting' && (
              <div className="loading-content">
                <Loader2 className="loading-spinner" />
                <span className="loading-text">Extracting tweet data...</span>
                <p className="loading-description">Check browser console for detailed logs</p>
              </div>
            )}
            
            {tweetExtractionStep === 'need-more' && (
              <div className="tweet-instructions">
                <h3>Need More Tweets </h3>
                <p>Only found {extractedTweets.length} tweets. For better analysis:</p>
                <ol>
                  <li>Scroll down to load more tweets</li>
                  <li>Try to get at least 15-20 recent tweets</li>
                  <li>Click "Try Again" when ready</li>
                </ol>
                <button onClick={handleStartTweetExtraction} className="extract-button">
                  Try Again ({extractedTweets.length} tweets found)
                </button>
                {extractedTweets.length > 0 && (
                  <div className="debug-info">
                    <details>
                      <summary>Debug: View extracted tweets</summary>
                      <div className="tweet-list">
                        {extractedTweets.slice(0, 3).map((tweet, i) => (
                          <div key={i} className="tweet-preview">
                            <p><strong>Tweet {i + 1}:</strong> {tweet.text.substring(0, 100)}...</p>
                            <p>Likes: {tweet.metrics.likes} | Retweets: {tweet.metrics.retweets}</p>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>
                )}
              </div>
            )}
            
            {tweetExtractionStep === 'complete' && (
              <div className="loading-content">
                <Loader2 className="loading-spinner" />
                <span className="loading-text">Analyzing {extractedTweets.length} tweets...</span>
              </div>
            )}
            
            {tweetExtractionStep === 'error' && (
              <div className="tweet-instructions">
                <h3>Extraction Error </h3>
                <p>Failed to extract tweets. Please try:</p>
                <ol>
                  <li>Refresh the page</li>
                  <li>Make sure you're on a profile with tweets</li>
                  <li>Scroll down to load tweets</li>
                  <li>Try the extraction again</li>
                </ol>
                <button onClick={handleStartTweetExtraction} className="extract-button">
                  Try Again
                </button>
              </div>
            )}
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

              {auditResults.topPerforming && auditResults.lowestPerforming && (
                <ContentPerformance
                  topPerforming={auditResults.topPerforming}
                  lowestPerforming={auditResults.lowestPerforming}
                  isExpanded={expandedSection === 'performance'}
                  onToggle={() => toggleSection('performance')}
                />
              )}

              {auditResults.contentTopics && (
                <ContentTopics
                  contentTopics={auditResults.contentTopics}
                  isExpanded={expandedSection === 'topics'}
                  onToggle={() => toggleSection('topics')}
                />
              )}
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