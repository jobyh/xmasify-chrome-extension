// We can only access the chrome api from background scripts.
chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, {
    message: "xmasifyToggle"
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message !== "xmasifyIsEnabled") return;

  if (request.data === true) {
    chrome.browserAction.setIcon({ path: "./images/icon-enabled.png" });
  }

  if (request.data === false) {
    chrome.browserAction.setIcon({ path: "./images/icon-disabled.png" });
  }
});
