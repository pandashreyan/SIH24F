import requests
import json

def test_endpoint(name, url, data):
    print(f"Testing {name}...")
    try:
        r = requests.post(url, json=data, timeout=120)
        print(f"Status: {r.status_code}")
        print(f"Response: {json.dumps(r.json(), indent=2)}")
        print("-" * 30)
    except Exception as e:
        print(f"ERROR: {e}")

BASE = "http://localhost:5000"

# 1. Chatbot
test_endpoint("CHATBOT", f"{BASE}/chat", {"message": "What is the Preamble?"})

# 2. Sentiment Hub (Critical Test)
test_endpoint("COMMUNITY PULSE", f"{BASE}/sentiment", {"text": "I hate this new law, it is full of errors!"})

# 3. Mystery Case
test_endpoint("MYSTERY CASE", f"{BASE}/storynext", {
    "caseTitle": "Right to Privacy", 
    "currentStep": 0, 
    "history": [], 
    "userChoice": ""
})
