let prevOptionsState = {};
let prevCustomState = {};

const options = [
  'sidebar', 'comments', 'shorts',
  'chips','homepage', 'notifBell',
  'leftmenu', 'ytDarkMode'
];

const otherOptions = options.filter(opt => opt !== 'focusAll' && opt !== 'ytDarkMode');

function sendRefreshMessageToContentScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'refreshClearYT' });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(options, (result) => {
    options.forEach(key => {
      const checkbox = document.getElementById(key);
      checkbox.checked = result[key] !== false;
    });

    prevCustomState = { ...result };
  });

  // Individual toggles
  otherOptions.forEach(key => {
    const el = document.getElementById(key);
    el.addEventListener('change', (e) => {
      const value = e.target.checked;
      chrome.storage.sync.set({ [key]: value });
      prevCustomState[key] = value;

      sendRefreshMessageToContentScript();
    });
  });

  // ytDarkMode toggle — no reload on enable, reload on disable
  const darkToggle = document.getElementById('ytDarkMode');
  darkToggle.addEventListener('change', (e) => {
    const value = e.target.checked;
    chrome.storage.sync.set({ ytDarkMode: value });
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'refreshClearYT' });
    });
  });  
});
