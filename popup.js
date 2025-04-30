const options = ['enabled', 'sidebar', 'comments', 'shorts', 'chips', 'autoplay', 'homepage'];

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(options, (result) => {
    options.forEach(key => {
      document.getElementById(key).checked = result[key] !== false;
    });
  });

  options.forEach(key => {
    document.getElementById(key).addEventListener('change', (e) => {
      chrome.storage.sync.set({ [key]: e.target.checked });
    });
  });
});
