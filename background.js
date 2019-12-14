// We can only access the chrome api from background scripts but they
// cannot directly access the current tab's DOM so communicate with the
// content script via messages.

// Extension icon click listener / handler.
chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, {
    message: "xmasify:toggle"
  });
});

// Reset whenever the active tab changes.
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.sendMessage(activeInfo.tabId, {
    message: "xmasify:init"
  });
});

// Message listener / handler.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message !== "xmasifyIsEnabled") return;

  // Bit of a cheeky ternary operator in the template string here
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
  const iconPath = `images/icon-${
    request.data === true ? "enabled" : "disabled"
  }-32.png`;

  chrome.browserAction.setIcon({ path: iconPath });
});
