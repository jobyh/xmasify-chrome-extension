chrome.browserAction.onClicked.addListener(tab => {
  chrome.tabs.sendMessage(tab.id, {
    message: "xmasify_clicked_action"
  });
});
