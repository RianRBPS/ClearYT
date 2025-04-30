let prevChipsState = true;       // Temporary memory for topic chips state
let prevOptionsState = {};       // Memory for all other options

const options = [
  'enabled', 'sidebar', 'comments', 'shorts',
  'chips', 'autoplay', 'homepage', 'notifBell', 'leftmenu'
];

const otherOptions = options.filter(opt => opt !== 'enabled');

// Disable/enable all checkboxes and restore values if needed
function updateCheckboxStates(isEnabled) {
  otherOptions.forEach(key => {
    const el = document.getElementById(key);

    if (!isEnabled) {
      // Save the current state before disabling
      prevOptionsState[key] = el.checked;
      el.checked = false;
      el.disabled = true;
    } else {
      // Restore previous state from memory
      el.checked = prevOptionsState[key] !== false;
      el.disabled = false;
    }
  });

  // Re-sync dependent logic like Topic Chips (must go AFTER enabling)
  syncChipsWithHomepage();
}


// Sync Topic Chips checkbox with Homepage Grid logic
function syncChipsWithHomepage() {
  const homepage = document.getElementById('homepage');
  const chips = document.getElementById('chips');
  const focusEnabled = document.getElementById('enabled').checked;

  // Prevent it from overriding state when Focus Mode is OFF
  if (!focusEnabled) return;

  if (!homepage.checked) {
    prevChipsState = chips.checked;
    chips.checked = false;
    chips.disabled = true;
  } else {
    chips.checked = prevChipsState;
    chips.disabled = false;
  }
}


// Sends a refresh message to content.js to apply new state immediately
function sendRefreshMessageToContentScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'refreshClearYT' });
  });
}

// MAIN
document.addEventListener('DOMContentLoaded', () => {
  // Load saved values
  chrome.storage.sync.get(options, (result) => {
    options.forEach(key => {
      const checkbox = document.getElementById(key);
      checkbox.checked = result[key] !== false;
    });

    // Cache initial states
    prevChipsState = result.chips !== false;
    prevOptionsState = { ...result };

    updateCheckboxStates(result.enabled !== false);
    syncChipsWithHomepage();
  });

  // Watch for any user-initiated changes
  options.forEach(key => {
    document.getElementById(key).addEventListener('change', (e) => {
      const enabled = document.getElementById('enabled').checked;

      if (enabled) {
        chrome.storage.sync.set({ [key]: e.target.checked });

        if (key === 'chips') {
          prevChipsState = e.target.checked;
        }

        prevOptionsState[key] = e.target.checked;

        // Send message to content.js to apply change immediately
        sendRefreshMessageToContentScript();
      }
    });
  });

  // Watch for homepage toggle to update chips availability
  document.getElementById('homepage').addEventListener('change', syncChipsWithHomepage);

  // Watch for enable toggle to restore or disable UI
  document.getElementById('enabled').addEventListener('change', (e) => {
    updateCheckboxStates(e.target.checked);
    syncChipsWithHomepage();

    // Trigger refresh on re-enabling
    if (e.target.checked) {
      sendRefreshMessageToContentScript();
    }
  });
});
