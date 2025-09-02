(() => {
  // SCRIPT INITIALIZATION GUARD 
  if (window.hasEmaExtensionRun) {
    console.log("EMA Extension: Script already running. Exiting to prevent errors.");
    return;
  }
  window.hasEmaExtensionRun = true;

  console.log('🚀 EMA Extension content script initializing...');

  // DECLARE ALL VARIABLES ONCE AT THE TOP
  let tweetCountObserver = null;
  let lastTweetCount = 0;

  // PROFILE DATA EXTRACTION
  const extractProfileData = () => {
    try {
      const isProfilePage = window.location.pathname.match(/^\/[^\/]+\/?$/);
      if (!isProfilePage) return null;
      const cleanText = (text) => text?.trim().replace(/\n+/g, ' ').replace(/\s+/g, ' ') || '';
      const nameElement = document.querySelector('[data-testid="UserName"] span') || document.querySelector('h1[role="heading"]') || document.querySelector('[data-testid="UserProfileHeader_Items"] h1');
      const name = cleanText(nameElement?.textContent);
      let handle = '';
      const screenNameElement = document.querySelector('[data-testid="UserScreenName"]');
      if (screenNameElement) {
        handle = cleanText(screenNameElement.textContent);
      }
      if (!handle || handle.includes('keyboard')) {
        const pathMatch = window.location.pathname.match(/^\/([^\/]+)$/);
        if (pathMatch) {
          handle = pathMatch[1];
        }
      }
      if (!handle || handle.includes('keyboard')) {
        const profileElements = document.querySelectorAll('[data-testid="UserProfileHeader_Items"] *');
        for (const element of profileElements) {
          const text = element.textContent;
          if (text && text.startsWith('@') && !text.includes('keyboard')) {
            handle = text.split(' ')[0];
            break;
          }
        }
      }
      if (handle) {
        handle = handle.replace(/View keyboard shortcuts/g, '').trim().split(' ')[0];
        if (!handle.startsWith('@')) {
          handle = '@' + handle;
        }
      }
      const avatarElement = document.querySelector('[data-testid="UserAvatar-Container-"] img') || document.querySelector('img[alt*="profile"]') || document.querySelector('[data-testid="UserProfileHeader"] img');
      const avatar = avatarElement?.src || '';
      const bioElement = document.querySelector('[data-testid="UserDescription"]') || document.querySelector('[data-testid="UserProfileHeader_Items"] div[dir="auto"]');
      const bio = cleanText(bioElement?.textContent);
      const followersElement = document.querySelector('a[href$="/verified_followers"] span') || document.querySelector('a[href$="/followers"] span') || document.querySelector('[data-testid="UserProfileHeader_Items"] a[href*="followers"]');
      let followers = cleanText(followersElement?.textContent);
      const followingElement = document.querySelector('a[href$="/following"] span') || document.querySelector('[data-testid="UserProfileHeader_Items"] a[href*="following"]');
      let following = cleanText(followingElement?.textContent);
      const formatCount = (count) => {
        if (!count) return '0';
        return count.replace(/[^\d\.KMB]/gi, '');
      };
      followers = formatCount(followers);
      following = formatCount(following);
      if (!name || !handle) {
        console.log('EMA Extension: Required profile fields not found');
        return null;
      }
      const profileData = {
        name,
        handle,
        avatar,
        bio: bio || 'No bio available',
        followers: followers || '0',
        following: following || '0',
        url: window.location.href,
        extractedAt: new Date().toISOString()
      };
      console.log('EMA Extension: Profile data extracted:', profileData);
      return profileData;
    } catch (error) {
      console.error('EMA Extension: Error extracting profile data:', error);
      return null;
    }
  };

  // TWEET COLLECTION SYSTEM
  const tweetCollector = {
    tweets: new Map(),
    seenUrls: new Set(),
    isRunning: false,
    lastExtraction: 0
  };

  const clearTweetCollection = () => {
    tweetCollector.tweets.clear();
    tweetCollector.seenUrls.clear();
    tweetCollector.isRunning = false;
    tweetCollector.lastExtraction = 0;
    console.log("Cleared tweet collection for fresh start");
  };

  const extractTweetData = () => {
    try {
      const now = Date.now();
      if (tweetCollector.isRunning || (now - tweetCollector.lastExtraction) < 2000) {
        return {
          tweets: Array.from(tweetCollector.tweets.values()),
          statistics: { total: tweetCollector.tweets.size },
          extractedAt: new Date().toISOString(),
          totalFound: tweetCollector.tweets.size
        };
      }
      tweetCollector.isRunning = true;
      tweetCollector.lastExtraction = now;
      const currentProfileHandle = window.location.pathname.split('/')[1]?.toLowerCase();
      if (!currentProfileHandle) {
        tweetCollector.isRunning = false;
        return { tweets: [], statistics: { total: 0 }, error: "Invalid profile URL", totalFound: 0 };
      }
      console.log(`Extracting tweets for @${currentProfileHandle}...`);
      const tweetElements = document.querySelectorAll('article[data-testid="tweet"], [data-testid="cellInnerDiv"] article');
      let newTweetsFound = 0;
      tweetElements.forEach((tweetEl) => {
        try {
          const linkEl = tweetEl.querySelector('a[href*="/status/"]');
          if (!linkEl?.href) return;
          const tweetUrl = linkEl.href;
          const tweetIdMatch = tweetUrl.match(/\/status\/(\d+)/);
          if (!tweetIdMatch) return;
          const tweetId = tweetIdMatch[1];
          if (tweetCollector.seenUrls.has(tweetUrl)) return;
          const authorLink = tweetEl.querySelector('[data-testid="User-Name"] a[role="link"]');
          if (!authorLink) return;
          const authorHandle = authorLink.getAttribute("href")?.split("/")[1]?.toLowerCase();
          if (!authorHandle || authorHandle !== currentProfileHandle) return;
          const socialContext = tweetEl.querySelector('[data-testid="socialContext"]');
          const contextText = socialContext?.textContent?.toLowerCase() || '';
          if (contextText.includes('retweeted') || contextText.includes('reposted') || contextText.includes('replying to') || tweetEl.querySelector('[data-testid="quoteTweet"]')) {
            return;
          }
          const textElements = tweetEl.querySelectorAll('[data-testid="tweetText"]');
          if (textElements.length === 0) return;
          const tweetText = Array.from(textElements).map(el => el.textContent.trim()).join(" ").trim();
          if (!tweetText || tweetText.length < 3) return;
          const timeEl = tweetEl.querySelector("time");
          const timestamp = timeEl?.getAttribute("datetime");
          if (!timestamp) return;

          
          const getMetric = (selector) => {
            // Enhanced selector for like buttons - covers all states
            let el;
            if (selector === '[data-testid="like"]') {
              el = tweetEl.querySelector('[data-testid="like"]') ||
                   tweetEl.querySelector('[data-testid="unlike"]') ||
                   tweetEl.querySelector('[aria-label*="like"]') ||
                   tweetEl.querySelector('[aria-label*="Like"]') ||
                   tweetEl.querySelector('[aria-label*="unlike"]') ||
                   tweetEl.querySelector('[aria-label*="Unlike"]');
            } else {
              el = tweetEl.querySelector(selector);
            }
            
            if (!el) {
              if (selector === '[data-testid="like"]') {
                console.log(`No like button found with any selector`);
              }
              return 0;
            }

            const textToSearch = el.getAttribute('aria-label') || '';
            
            // ENHANCED DEBUGGING: Log ALL like button aria-labels, even empty ones
            if (selector === '[data-testid="like"]') {
              console.log(`Like button aria-label: "${textToSearch}" (Length: ${textToSearch.length})`);
              
              // Also log the button's other attributes for debugging
              console.log(`Like button debug:`, {
                'aria-label': textToSearch,
                'textContent': el.textContent,
                'title': el.getAttribute('title'),
                'data-state': el.getAttribute('data-state'),
                'className': el.className,
                'testId': el.getAttribute('data-testid')
              });
            }
            
            // ENHANCED REGEX: Look for numbers anywhere in the text
            const match = textToSearch.match(/(\d+(?:,\d+)*(?:\.\d+)?)/);

            if (match) {
              let num = parseFloat(match[1].replace(/,/g, ''));
              console.log(`Found number: ${num} from "${textToSearch}"`);
              return Math.round(num);
            }

            console.log(`No number found in: "${textToSearch}"`);
            return 0;
          };
          // ENHANCED: Extract views from analytics button
          const getViews = () => {
            // Method 1: Look for analytics/views button
            const analyticsButton = tweetEl.querySelector('[data-testid="analytics"]');
            if (analyticsButton) {
              const viewText = analyticsButton.getAttribute('aria-label') || analyticsButton.textContent || '';
              const viewMatch = viewText.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*([kmb]?)/i);
              if (viewMatch) {
                let num = parseFloat(viewMatch[1].replace(/,/g, ""));
                const suffix = viewMatch[2]?.toLowerCase();
                if (suffix === "k") num *= 1000;
                else if (suffix === "m") num *= 1000000;
                else if (suffix === "b") num *= 1000000000;
                return Math.round(num);
              }
            }
            
            // Method 2: Look for view count in tweet text or aria labels
            const viewElements = tweetEl.querySelectorAll('*[aria-label*="view"], *[aria-label*="View"]');
            for (const el of viewElements) {
              const label = el.getAttribute('aria-label');
              if (label && label.includes('view')) {
                const match = label.match(/(\d+(?:,\d+)*(?:\.\d+)?)\s*([kmb]?)\s*view/i);
                if (match) {
                  let num = parseFloat(match[1].replace(/,/g, ""));
                  const suffix = match[2]?.toLowerCase();
                  if (suffix === "k") num *= 1000;
                  else if (suffix === "m") num *= 1000000;
                  return Math.round(num);
                }
              }
            }
            
            return 0;
          };
          const tweetData = {
            id: tweetId, 
            text: tweetText, 
            url: tweetUrl, 
            timestamp: timestamp, 
            date: new Date(timestamp).toLocaleDateString(), 
            type: contextText.includes("pinned") ? "pinned" : "original", 
            isRetweet: false,
            metrics: { 
              likes: getMetric('[data-testid="like"]'),
              retweets: getMetric('[data-testid="retweet"]'),
              replies: getMetric('[data-testid="reply"]'),
              views: getViews()
            },
            media: { 
              hasImage: tweetEl.querySelector('[data-testid="tweetPhoto"]') !== null, 
              hasVideo: tweetEl.querySelector('[data-testid="videoPlayer"]') !== null || tweetEl.querySelector('[data-testid="gifPlayer"]') !== null, 
              hasMedia: false 
            },
            author: { handle: `@${currentProfileHandle}`, isOwner: true }, 
            extractedAt: new Date().toISOString()
          };
          tweetData.media.hasMedia = tweetData.media.hasImage || tweetData.media.hasVideo;
          tweetCollector.tweets.set(tweetId, tweetData);
          tweetCollector.seenUrls.add(tweetUrl);
          newTweetsFound++;
        } catch (err) { console.warn(`Error processing a tweet:`, err); }
      });
      const allTweets = Array.from(tweetCollector.tweets.values()).sort((a, b) => {
        if (a.type === "pinned" && b.type !== "pinned") return -1;
        if (b.type === "pinned" && a.type !== "pinned") return 1;
        return new Date(b.timestamp) - new Date(a.timestamp);
      });
      tweetCollector.isRunning = false;
      if (newTweetsFound > 0) {
        console.log(`Extraction complete: ${newTweetsFound} new, ${allTweets.length} total`);
      }
      return {
        tweets: allTweets,
        statistics: {
          total: allTweets.length, originals: allTweets.filter(t => t.type === "original").length, pinned: allTweets.filter(t => t.type === "pinned").length,
          withImages: allTweets.filter(t => t.media.hasImage).length, withVideos: allTweets.filter(t => t.media.hasVideo).length,
         avgLikes: allTweets.length > 0 ? Math.round(allTweets.reduce((sum, t) => sum + t.metrics.likes, 0) / allTweets.length) : 0
        },
        extractedAt: new Date().toISOString(), totalFound: allTweets.length
      };
    } catch (error) {
      tweetCollector.isRunning = false;
      console.error("Tweet extraction error:", error);
      return { tweets: [], statistics: { total: 0 }, error: error.message, extractedAt: new Date().toISOString(), totalFound: 0 };
    }
  };

  const countVisibleTweets = () => tweetCollector.tweets.size;

  //OBSERVER SETUP
  const setupTweetCountObserver = () => {
    if (tweetCountObserver) tweetCountObserver.disconnect();
    chrome.storage.local.clear();
    clearTweetCollection();
    let debounceTimer = null;
    setTimeout(() => {
      extractTweetData();
      lastTweetCount = countVisibleTweets();
      notifyTweetCount(lastTweetCount);
      console.log(`Started with ${lastTweetCount} tweets`);
    }, 2000);
    tweetCountObserver = new MutationObserver((mutations) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      const hasNewNodes = mutations.some(m => m.addedNodes.length > 0);
      if (hasNewNodes) {
        debounceTimer = setTimeout(() => {
          extractTweetData();
          const currentCount = countVisibleTweets();
          if (currentCount > lastTweetCount) {
            const newTweets = currentCount - lastTweetCount;
            lastTweetCount = currentCount;
            notifyTweetCount(currentCount);
            console.log(`Found ${newTweets} new tweets! Total: ${currentCount}`);
          }
        }, 3000);
      }
    });
    const container = document.querySelector('main[role="main"]') || document.body;
    tweetCountObserver.observe(container, { childList: true, subtree: true });
    console.log('Stable observer started');
  };

  const stopTweetCountObserver = () => {
    if (tweetCountObserver) {
      tweetCountObserver.disconnect();
      tweetCountObserver = null;
      console.log('Tweet observation stopped');
    }
  };

  // ADD THIS MISSING FUNCTION
  const notifyTweetCount = (count) => {
    chrome.runtime.sendMessage({
      type: 'TWEET_COUNT_UPDATED',
      count: count
    }).catch(() => {
      // Popup might not be open, ignore error
    });
  };

  // MESSAGE LISTENER
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET_PROFILE_DATA') {
      sendResponse({ success: true, data: extractProfileData() });
    } else if (request.type === 'EXTRACT_TWEETS') {
      const result = extractTweetData();
      sendResponse({ success: true, data: result.tweets, statistics: result.statistics, count: result.totalFound });
    } else if (request.type === 'START_TWEET_COUNTING') {
      setupTweetCountObserver();
      sendResponse({ success: true, count: countVisibleTweets() });
    } else if (request.type === 'STOP_TWEET_COUNTING') {
      stopTweetCountObserver();
      sendResponse({ success: true });
    } else if (request.type === 'GET_CURRENT_TWEET_COUNT') {
      sendResponse({ success: true, count: countVisibleTweets() });
    }
    return true; // Keep the message channel open for async response
  });

})();
