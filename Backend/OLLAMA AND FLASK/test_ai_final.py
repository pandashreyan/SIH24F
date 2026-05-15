import requests
import json

def test_endpoint(name, url, data):
    print(f"Testing {name}...")
    try:
        r = requests.post(url, json=data, timeout=120)
        print(f"Status: {r.status_code}")
        resp = r.json()
        # Truncate long drafts for display
        if 'draft' in resp: resp['draft'] = resp['draft'][:100] + "..."
        print(f"Response: {json.dumps(resp, indent=2)}")
        print("-" * 30)
    except Exception as e:
        print(f"ERROR: {e}")

BASE = "http://localhost:5000"

# 1. Hindi Chatbot Test
test_endpoint("HINDI CHATBOT", f"{BASE}/chat", {"message": "मौलिक अधिकार क्या हैं?", "lang": "Hindi"})

# 2. Verdict Predictor (New Feature)
test_endpoint("VERDICT PREDICTOR", f"{BASE}/predict_verdict", {
    "scenario": "My employer is refusing to pay my salary for last 2 months.",
    "lang": "English"
})

# 3. Legal Drafter (New Feature)
test_endpoint("LEGAL DRAFTER", f"{BASE}/generate_draft", {
    "scenario": "Complaint against illegal construction",
    "lang": "English"
})

# 4. Hindi Storytelling
test_endpoint("HINDI STORY", f"{BASE}/storynext", {
    "caseTitle": "Landmark: Kesavananda Bharati", 
    "currentStep": 0, 
    "history": [], 
    "userChoice": "",
    "lang": "Hindi"
})
