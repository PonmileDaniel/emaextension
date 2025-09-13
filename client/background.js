// Basic background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Check if side panel is supported
const supportsSidePanel = typeof chrome.sidePanel !== 'undefined';

if (supportsSidePanel) {
  // Side panel management for X/Twitter sites (Chrome only)
  const X_ORIGINS = ['https://twitter.com', 'https://x.com'];

  chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
    if (!tab.url) return;
    const url = new URL(tab.url);
    
    // Enables the side panel on X/Twitter sites
    if (X_ORIGINS.includes(url.origin)) {
      await chrome.sidePanel.setOptions({
        tabId,
        path: 'popup.html',
        enabled: true
      });
    } else {
      // Disables the side panel on all other sites
      await chrome.sidePanel.setOptions({
        tabId,
        enabled: false
      });
    }
  });

  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
} else {
  console.log('Side panel not supported, using traditional popup');
}

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