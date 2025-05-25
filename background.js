chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    focusAll: false,
    sidebar: false,
    comments: false,
    shorts: false,
    chips: false,
    homepage: false,
    notifBell: false,
    leftmenu: false,
    ytDarkMode: false,
    whitelist: []
  });
});
