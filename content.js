function applyClearYT(prefs) {
  const allSelectors = {
    sidebar: ['#related', '#secondary'],
    comments: ['ytd-comments'],
    shorts: [
      'ytd-shorts-section-renderer',
      'ytd-reel-shelf-renderer',
      'ytd-rich-section-renderer',
      'a[href^="/shorts"]',
      'ytd-video-renderer[is-shorts]',
      'ytd-grid-video-renderer[is-shorts]',
      'ytd-reel-item-renderer',
      'a[title="Shorts"]',
      'ytd-guide-entry-renderer a[href="/shorts"]'
    ],
    chips: ['#chips-wrapper'],
    notifBell: ['ytd-notification-topbar-button-renderer'],
    leftmenu: [
      '#guide-content',
      '#guide-wrapper',
      'ytd-mini-guide-renderer',
      '#guide',
      'tp-yt-app-drawer'
    ]
  };

  Object.values(allSelectors).flat().forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = '';
    });
  });

  const homepageGrid = document.querySelector('ytd-rich-grid-renderer');
  if (homepageGrid) {
    homepageGrid.querySelectorAll('ytd-rich-item-renderer').forEach(el => {
      el.style.display = '';
    });
  }

  const elementsToHide = [];
  const shouldApply = (key) => prefs.focusAll === true || prefs[key] === true;

  if (shouldApply('sidebar')) elementsToHide.push(...allSelectors.sidebar);
  if (shouldApply('comments')) elementsToHide.push(...allSelectors.comments);
  if (shouldApply('shorts')) elementsToHide.push(...allSelectors.shorts);
  if (shouldApply('chips')) elementsToHide.push(...allSelectors.chips);
  if (shouldApply('notifBell')) elementsToHide.push(...allSelectors.notifBell);
  if (shouldApply('leftmenu')) elementsToHide.push(...allSelectors.leftmenu);

  if (shouldApply('homepage')) {
    hideHomepageTilesOnly();
  }

  elementsToHide.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = 'none';
    });
  });

  if (prefs.ytDarkMode === true) {
    try {
      localStorage.setItem('yt-dark-theme', 'true');
      localStorage.setItem('yt-user-theme', 'dark');
      localStorage.setItem('yt-player-theme', 'dark');
      localStorage.setItem('PREF', 'f6=400');

      document.documentElement.setAttribute('dark', 'true');
      document.documentElement.classList.add('dark');

      const bell = document.querySelector('ytd-notification-topbar-button-renderer');
      const create = document.querySelector('ytd-topbar-menu-button-renderer');
      [bell, create].forEach(el => {
        if (el) el.style.filter = 'invert(1)';
      });
    } catch (e) {
      console.warn('[ClearYT] Could not set dark mode:', e);
    }
  }
}

function hideHomepageTilesOnly() {
  const homepageGrid = document.querySelector('ytd-rich-grid-renderer');
  if (homepageGrid) {
    homepageGrid.querySelectorAll('ytd-rich-item-renderer').forEach(el => {
      el.style.display = 'none';
    });
  }

  const searchContainer = document.querySelector('#center');
  if (searchContainer) {
    searchContainer.style.margin = 'auto';
    searchContainer.style.justifyContent = 'center';
    searchContainer.style.display = 'flex';
  }
}

// Initial application
chrome.storage.sync.get(null, applyClearYT);

// Respond to popup.js trigger
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'refreshClearYT') {
    chrome.storage.sync.get(null, applyClearYT);
  }
});

function debounce(fn, delay = 150) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
}

// MutationObserver for general elements
const generalObserver = new MutationObserver(
  debounce(() => {
    chrome.storage.sync.get(null, applyClearYT);
  }, 150)
);
generalObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// Dedicated homepage tile observer
const observeHomepageTiles = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach(node => {
      if (
        node.nodeType === 1 &&
        node.tagName === 'YTD-RICH-ITEM-RENDERER'
      ) {
        node.style.display = 'none';
      }
    });
  }
});


function watchHomepageTileChanges() {
  const grid = document.querySelector('ytd-rich-grid-renderer');
  if (grid) {
    observeHomepageTiles.observe(grid, {
      childList: true,
      subtree: true
    });
    // Kickstart initial hiding for a snappy feel
    hideHomepageTilesOnly();
  } else {
    setTimeout(watchHomepageTileChanges, 500);
  }
}

watchHomepageTileChanges();

// Watch for YouTube SPA URL changes
let lastUrl = location.href;
setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    chrome.storage.sync.get(null, applyClearYT);
  }
}, 500);
