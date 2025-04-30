const elementsToHide = [
  '#related',                       // sidebar
  'ytd-comments',                  // comments
  '#secondary',                    // sidebar alt
  '#chips-wrapper',               // filter chips
  'ytd-rich-grid-renderer',        // home grid
  'ytd-shorts-section-renderer',   // Shorts section
  'ytd-guide-section-renderer',    // Explore/trending side menu
  '.ytp-autonav-toggle-button'     // autoplay button
];

function hideElements() {
  elementsToHide.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = 'none';
    });
  });
}

// Only apply if user has focus mode enabled
chrome.storage.sync.get(['enabled'], (result) => {
  if (result.enabled !== false) {
    hideElements();
    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });
  }
});
