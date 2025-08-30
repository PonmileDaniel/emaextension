const extractProfileData = () => {
  try {
    // Check if we're on a profile page
    const isProfilePage = window.location.pathname.match(/^\/[^\/]+$/);
    if (!isProfilePage) return null;

    // Helper function to clean text
    const cleanText = (text) => text?.trim().replace(/\n+/g, ' ').replace(/\s+/g, ' ') || '';

    // Extract profile name
    const nameElement = document.querySelector('[data-testid="UserName"] span') || 
                       document.querySelector('h1[role="heading"]') ||
                       document.querySelector('[data-testid="UserProfileHeader_Items"] h1');
    const name = cleanText(nameElement?.textContent);

    // Extract username/handle
    const handleElement = document.querySelector('[data-testid="UserName"]') ||
                         document.querySelector('[data-testid="UserName"] div:nth-child(2)') ||
                         document.querySelector('div[dir="ltr"]:has-text("@")');
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

    // Method 3: Look for @ symbol in profile header
    if (!handle || handle.includes('keyboard')) {
        const profileElements = document.querySelectorAll('[data-testid="UserProfileHeader_Items"] *');
        for (const element of profileElements) {
            const text = element.textContent;
            if (text && text.startsWith('@') && !text.includes('keyboard')) {
                handle = text.split(' ')[0]; // Take only the username part
                break;
            }
        }
    }

    // Clean up the handle and ensure it starts with @
    if (handle) {
        // Remove any extra text like "View keyboard shortcuts"
        handle = handle.replace(/View keyboard shortcuts/g, '').trim();
        handle = handle.split(' ')[0]; // Take first word only
  
        if (!handle.startsWith('@')) {
            handle = '@' + handle;
        }
    }

    // Extract profile picture
    const avatarElement = document.querySelector('[data-testid="UserAvatar-Container-"] img') ||
                         document.querySelector('img[alt*="profile"]') ||
                         document.querySelector('[data-testid="UserProfileHeader"] img');
    const avatar = avatarElement?.src || '';

    // Extract bio
    const bioElement = document.querySelector('[data-testid="UserDescription"]') ||
                      document.querySelector('[data-testid="UserProfileHeader_Items"] div[dir="auto"]');
    const bio = cleanText(bioElement?.textContent);

    // Extract follower count
    const followersElement = document.querySelector('a[href$="/verified_followers"] span') ||
                           document.querySelector('a[href$="/followers"] span') ||
                           document.querySelector('[data-testid="UserProfileHeader_Items"] a[href*="followers"]');
    let followers = cleanText(followersElement?.textContent);

    // Extract following count
    const followingElement = document.querySelector('a[href$="/following"] span') ||
                           document.querySelector('[data-testid="UserProfileHeader_Items"] a[href*="following"]');
    let following = cleanText(followingElement?.textContent);

    // Format follower/following counts
    const formatCount = (count) => {
      if (!count) return '0';
      // Remove any non-numeric characters except K, M, B
      return count.replace(/[^\d\.KMB]/gi, '');
    };

    followers = formatCount(followers);
    following = formatCount(following);

    // Validate required fields
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

// Function to store profile data
const storeProfileData = (profileData) => {
  if (!profileData) return;
  
  chrome.storage.local.set({
    currentProfile: profileData,
    lastExtracted: Date.now()
  }, () => {
    console.log('EMA Extension: Profile data stored');
    
    // Notify background script that new data is available
    chrome.runtime.sendMessage({
      type: 'PROFILE_DATA_EXTRACTED',
      data: profileData
    });
  });
};

// Main extraction function with retry logic
const attemptExtraction = () => {
  const profileData = extractProfileData();
  if (profileData) {
    // DON'T store automatically - just log for debugging
    console.log('EMA Extension: Profile data ready for audit:', profileData);
    
    // Send to popup if it's open and requesting data
    chrome.runtime.sendMessage({
      type: 'PROFILE_DATA_READY',
      data: profileData
    }).catch(() => {
      // Popup might not be open, that's fine
    });
  } else {
    setTimeout(attemptExtraction, 2000);
  }
};

// Wait for page to load and extract data
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attemptExtraction);
} else {
  attemptExtraction();
}

// Listen for navigation changes (SPA routing)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(attemptExtraction, 1000); // Wait for new content to load
  }
}).observe(document.body, { childList: true, subtree: true });

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_PROFILE_DATA') {
    const profileData = extractProfileData();
    sendResponse({ success: true, data: profileData });
  } else if (request.type === 'SAVE_AUDIT_RESULTS') {
    // Save only when audit is completed
    const { profileData, auditResults } = request.data;
    chrome.storage.local.set({
      auditedProfiles: {
        [profileData.handle]: {
          ...profileData,
          auditResults,
          auditedAt: new Date().toISOString()
        }
      }
    });
    sendResponse({ success: true });
  }
});