from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import requests
import re
import base64
import logging

logging.basicConfig(level=logging.DEBUG)
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load ML model and vectorizer
model = joblib.load("ML models/phishing_detection_model.pkl")
vectorizer = joblib.load("ML models/tfidf_vectorizer.pkl")

VT_API_KEY = "your virustotal API key "

def clean_text(text):
    text = text.lower()
    text = re.sub(r'http\S+|www.\S+', '', text)
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

@app.route("/analyze-email-and-urls", methods=["POST"])
def analyze_email_and_urls():
    emails = request.json.get("emails", [])
    results = []

    for email in emails:
        email_body = email.get("body", "")
        urls = email.get("urls", [])

        email_analysis = None
        url_results = []
        combined_score = 0

        if email_body:
            cleaned_body = clean_text(email_body)
            vectorized_body = vectorizer.transform([cleaned_body])
            prediction = model.predict(vectorized_body)[0]
            probability = model.predict_proba(vectorized_body).max()

            email_analysis = {
                "prediction": "phishing" if prediction == 1 else "legitimate",
                "confidence_percentage": round(probability * 100, 2),
            }
            combined_score += probability * 100

        headers = {"x-apikey": VT_API_KEY}
        for url in urls:
            encoded_url = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
            response = requests.get(
                f"https://www.virustotal.com/api/v3/urls/{encoded_url}",
                headers=headers,
            )

            if response.status_code == 200:
                result = response.json()
                malicious_score = result["data"]["attributes"]["last_analysis_stats"]["malicious"]
                total_score = result["data"]["attributes"]["last_analysis_stats"]["total"]
                malicious_percentage = (malicious_score / total_score) * 100 if total_score > 0 else 0

                url_results.append({
                    "url": url,
                    "malicious_score_percentage": round(malicious_percentage, 2),
                })
                combined_score += malicious_percentage

        combined_score = combined_score / (1 + len(urls)) if urls else combined_score

        results.append({
            "subject": email.get("subject", ""),
            "sender": email.get("sender", ""),
            "email_body_analysis": email_analysis,
            "url_analysis": url_results,
            "combined_risk_score_percentage": round(combined_score, 2),
        })

    return jsonify({"analysis": results})

if __name__ == "__main__":
    app.run(debug=True)
