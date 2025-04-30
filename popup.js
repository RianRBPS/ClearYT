let prevOptionsState = {};
let prevCustomState = {};

const options = [
  'focusAll', 'sidebar', 'comments', 'shorts',
  'chips', 'autoplay', 'homepage', 'notifBell',
  'leftmenu', 'ytDarkMode'
];

const otherOptions = options.filter(opt => opt !== 'focusAll' && opt !== 'ytDarkMode');

function updateCheckboxStates(isFocusModeOn) {
  otherOptions.forEach(key => {
    const el = document.getElementById(key);
    if (isFocusModeOn) {
      prevOptionsState[key] = el.checked;
      el.checked = true;
      el.disabled = true;
    } else {
      const restored = prevCustomState[key] ?? false;
      el.checked = restored;
      el.disabled = false;
    }
  });
}

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
    updateCheckboxStates(result.focusAll === true);
  });

  // Focus Mode toggle
  document.getElementById('focusAll').addEventListener('change', (e) => {
    const checked = e.target.checked;
    chrome.storage.sync.set({ focusAll: checked });

    if (checked) {
      otherOptions.forEach(key => {
        const el = document.getElementById(key);
        prevCustomState[key] = el.checked;
        el.checked = true;
        el.disabled = true;
        chrome.storage.sync.set({ [key]: true });
      });
    } else {
      otherOptions.forEach(key => {
        const el = document.getElementById(key);
        const prev = prevCustomState[key] ?? false;
        el.checked = prev;
        el.disabled = false;
        chrome.storage.sync.set({ [key]: prev });
      });
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.reload(tabs[0].id);
    });
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
      if (value) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'refreshClearYT' });
      } else {
        chrome.tabs.reload(tabs[0].id);
      }
    });
  });
});
