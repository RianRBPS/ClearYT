document.getElementById('toggle').addEventListener('change', (e) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: () => {
        if (e.target.checked) {
          location.reload(); // Refresh to apply
        }
      }
    });
  });
});
