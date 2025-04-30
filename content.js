chrome.storage.sync.get(null, (prefs) => {
  if (prefs.enabled === false) return;

  const elements = [];

  if (prefs.sidebar !== false) elements.push('#related', '#secondary');
  if (prefs.comments !== false) elements.push('ytd-comments');
  if (prefs.shorts !== false) elements.push('ytd-shorts-section-renderer');
  if (prefs.chips !== false) elements.push('#chips-wrapper');
  if (prefs.homepage !== false) elements.push('ytd-rich-grid-renderer');
  if (prefs.autoplay === true) elements.push('.ytp-autonav-toggle-button');

  function hideElements() {
    elements.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.display = 'none';
      });
    });
  }

  hideElements();

  const observer = new MutationObserver(hideElements);
  observer.observe(document.body, { childList: true, subtree: true });
});
