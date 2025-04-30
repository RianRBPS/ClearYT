function applyClearYT(prefs) {
  if (prefs.enabled === false) return;

  const elements = [];

  if (prefs.sidebar !== false) elements.push('#related', '#secondary');
  if (prefs.comments !== false) elements.push('ytd-comments');

  if (prefs.shorts !== false) {
    elements.push(
      'ytd-shorts-section-renderer',
      'ytd-reel-shelf-renderer',
      'ytd-rich-section-renderer',
      'a[href^="/shorts"]',
      'ytd-video-renderer[is-shorts]',
      'ytd-grid-video-renderer[is-shorts]',
      'ytd-reel-item-renderer',
      'a[title="Shorts"]',
      'ytd-guide-entry-renderer a[href="/shorts"]'
    );
  }

  if (prefs.chips !== false) elements.push('#chips-wrapper');
  if (prefs.homepage !== false) {
    elements.push('ytd-rich-grid-renderer');

    // Center the search bar when homepage grid is hidden
    const searchContainer = document.querySelector('#center');
    if (searchContainer) {
      searchContainer.style.margin = 'auto';
      searchContainer.style.justifyContent = 'center';
      searchContainer.style.display = 'flex';
    }
  }

  if (prefs.notifBell !== false) {
    elements.push('ytd-notification-topbar-button-renderer');
  }

  if (prefs.autoplay === true) {
    elements.push('.ytp-autonav-toggle-button');
  }

  if (prefs.leftmenu !== false) {
    elements.push(
      '#guide-content',
      '#guide-wrapper',
      'ytd-mini-guide-renderer',
      '#guide',
      'tp-yt-app-drawer'
    );
  }

  function hideElements() {
    elements.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.display = 'none';
        console.log(`[ClearYT] Hid: ${selector}`);
      });
    });
  }

  hideElements();

  const observer = new MutationObserver(hideElements);
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Initial execution
chrome.storage.sync.get(null, applyClearYT);

// Listen for real-time updates from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'refreshClearYT') {
    chrome.storage.sync.get(null, applyClearYT);
  }
});
