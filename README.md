# Phishing Detector Chrome Extension

This Chrome extension helps detect phishing attempts in emails using a combination of the VirusTotal API and machine learning. It integrates with Gmail to analyze email content and embedded links, providing an overall risk score.

---

## Features
- **Email Content Analysis**: Uses a trained machine learning model to classify email content as phishing or legitimate.
- **URL Analysis**: Leverages the VirusTotal API to evaluate the safety of URLs in emails.
- **Risk Assessment**: Provides a combined risk score based on email content and URL analysis.
- **Seamless Integration**: Works with Gmail for extracting and analyzing email data.

---

## Installation
### 1. Chrome Extension
1. Clone or download this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer Mode** in the top-right corner.
4. Click on **Load unpacked** and select the folder containing the extension files.
5. The extension should now be added to your browser.

### 2. Backend Setup
The extension requires a Flask server for machine learning analysis.
1. Ensure you have Python 3.7+ and pip installed.
2. Navigate to the project directory containing `app.py`.
3. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt

Phishing-Detector/
│
├── ML models/
│   ├── phishing_detection_model.pkl  # Serialized ML model
│   └── tfidf_vectorizer.pkl          # Serialized TF-IDF vectorizer
│
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
├── background.js       # Background script for managing events
├── content.js          # Content script to extract email data
├── popup.html          # HTML for extension popup
├── popup.js            # JS for extension popup functionality
├── style.css           # CSS for extension popup
├── app.py              # Flask backend for ML analysis
├── manifest.json       # Chrome extension manifest file
├── README.md           # Documentation
└── requirements.txt    # Python dependencies
