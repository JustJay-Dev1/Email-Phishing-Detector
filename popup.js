document.addEventListener("DOMContentLoaded", () => {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "Scanning emails...";
  
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "extractEmailsAndUrls" }, (response) => {
        if (!response || response.error) {
          resultsDiv.innerText = `Error: ${response ? response.error : "Failed to extract email data."}`;
          return;
        }
  
        const emails = response.emails;
  
        // Send email data to the backend server for analysis
        chrome.runtime.sendMessage({ action: "analyzeEmailsAndUrls", emails }, (result) => {
          if (!result || result.error) {
            resultsDiv.innerText = `Error: ${result ? result.error : "Failed to process email data."}`;
            return;
          }
  
          const analysisResults = result.analysis;
  
          // Display results for all emails
          resultsDiv.innerHTML = analysisResults
            .map(
              (email) => `
                <div>
                  <p><strong>Subject:</strong> ${email.subject}</p>
                  <p><strong>Sender:</strong> ${email.sender}</p>
                  <p><strong>Email Analysis:</strong> ${email.email_body_analysis.prediction} 
                     (Confidence: <span style="color: red;">${email.email_body_analysis.confidence_percentage}%</span>)</p>
                  <p><strong>URLs:</strong> ${
                    email.url_analysis.length > 0
                      ? email.url_analysis
                          .map(
                            (url) =>
                              `<p>${url.url} - Malicious: <span style="color: red;">${url.malicious_score_percentage}%</span></p>`
                          )
                          .join("")
                      : "No URLs detected."
                  }</p>
                  <p><strong>Combined Risk Score:</strong> <span style="color: red;">${email.combined_risk_score_percentage}%</span></p>
                  <hr>
                </div>
              `
            )
            .join("");
        });
      });
    });
  });