chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.includes("mail.google.com")) {
      // Inject the content script into the Gmail page
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["content.js"],
      });
  
      // Open the extension popup automatically
      chrome.action.openPopup();
    }
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "analyzeEmailsAndUrls") {
      fetch("http://127.0.0.1:5000/analyze-email-and-urls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emails: message.emails }),
      })
        .then((response) => response.json())
        .then((data) => sendResponse(data))
        .catch((error) => sendResponse({ error: error.message }));
  
      return true; // Indicate asynchronous response
    }
  });