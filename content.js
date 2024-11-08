let focusModeActive = false;

// Initializing state using Chrome storage
chrome.storage.local.get(["focusModeActive"], (result) => {
  focusModeActive = result.focusModeActive || false;
  if (focusModeActive) {
    document.body.classList.add("focus-mode-active");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  if (focusModeActive) {
    document.body.classList.add("focus-mode-active");
  }
});

// Adding message listener for focus mode toggle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleFocusMode") {
    focusModeActive = !focusModeActive;
    document.body.classList.toggle("focus-mode-active", focusModeActive);
    chrome.storage.local.set({ focusModeActive });
    sendResponse({ status: "success" });
  }
});

// Waiting for body to be available before setting up observer
const setupObserver = () => {
  if (document.body) {
    const observer = new MutationObserver(() => {
      if (
        focusModeActive &&
        !document.body.classList.contains("focus-mode-active")
      ) {
        document.body.classList.add("focus-mode-active");
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
      childList: true,
      subtree: true,
    });
  } else {
    // Retrying after a short delay if body is not available yet
    setTimeout(setupObserver, 100);
  }
};

setupObserver();
