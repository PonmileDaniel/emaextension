// Basic background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Add any background functionality you need here

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'PROFILE_DATA_EXTRACTED') {
    console.log('Profile data received:', request.data);
    
    // Store in background for popup access
    chrome.storage.local.set({
      latestProfile: request.data,
      profileAvailable: true
    });
  }
});

// Listen for tab updates to detect X/Twitter navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const isXProfile = tab.url.match(/^https?:\/\/(twitter|x)\.com\/[^\/]+\/?$/);
    if (isXProfile) {
      // Inject content script if needed
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      }).catch(err => {
        // Script might already be injected
        console.log('Content script injection skipped:', err.message);
      });
    }
  }
});