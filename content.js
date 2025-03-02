let hasScanned = false; // Flag to ensure the scan happens only once

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "extractEmailsAndUrls" && !hasScanned) {
    hasScanned = true; // Set the flag to true to prevent multiple scans

    // Wait for Gmail's dynamic content to fully load
    setTimeout(() => {
      const emailElements = document.querySelectorAll(".zA"); // Gmail's email row selector
      const emails = [];

      emailElements.forEach((email) => {
        // Extract email details
        const subject = email.querySelector(".bog")?.innerText || "(No Subject)";
        const sender = email.querySelector(".yP")?.innerText || "(No Sender)";
        const bodyPreview = email.querySelector(".y2")?.innerText || "(No Body Preview)";

        // Extract URLs from the body preview
        const urls = [];
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const matches = bodyPreview.match(urlRegex);
        if (matches) {
          matches.forEach((url) => urls.push(url));
        }

        // Look for anchor tags to extract URLs
        const anchorTags = email.querySelectorAll("a[href]");
        anchorTags.forEach((anchor) => {
          if (!urls.includes(anchor.href)) {
            urls.push(anchor.href);
          }
        });

        emails.push({
          subject: subject.trim(),
          sender: sender.trim(),
          body: bodyPreview.trim(),
          urls: urls,
        });
      });

      // Send the extracted data back to the popup
      sendResponse({ emails });
    }, 1500); // Delay to allow Gmail to fully render content

    return true; // Keep the message channel open for async response
  }
});