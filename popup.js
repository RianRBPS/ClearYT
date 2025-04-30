// Load saved toggle state
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['enabled'], (result) => {
    document.getElementById('toggle').checked = result.enabled !== false; // default true
  });
});

// Save toggle state on change
document.getElementById('toggle').addEventListener('change', (e) => {
  chrome.storage.sync.set({ enabled: e.target.checked });
});
