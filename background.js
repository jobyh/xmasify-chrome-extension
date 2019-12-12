// We can only access the chrome api from background scripts.
chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, {
    message: "xmasifyToggle"
  });
});
