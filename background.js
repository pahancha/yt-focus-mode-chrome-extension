// Listening for extension installation
chrome.runtime.onInstalled.addListener(() => {
  // Initializing the storage with default state
  chrome.storage.local.set({ focusModeActive: false });
});

// Keeping the existing click listener with error handling
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.includes("youtube.com")) {
    try {
      await chrome.tabs
        .sendMessage(tab.id, { action: "toggleFocusMode" })
        .catch(() => {
          // Reloading the tab if the content script isn't ready
          chrome.tabs.reload(tab.id);
        });
    } catch (error) {
      console.log("Error sending message:", error);
    }
  }
});
