import requests
import json
import time

def report(name, status, response):
    status_icon = "[PASS]" if status == 200 or status == 201 else "[FAIL]"
    print(f"{status_icon} {name}")
    if status != 200 and status != 201:
        print(f"   Response: {response}")
    print("-" * 40)

# CONFIG
AUTH_BASE = "http://localhost:8080/api"
AI_BASE = "http://localhost:5000"

print("STARTING ULTIMATE FULL-STACK AUDIT\n")

# 1. AUTHENTICATION TEST (Spring Boot + H2)
print("--- [SECTION 1: AUTHENTICATION] ---")
test_user = {
    "username": f"tester_{int(time.time())}",
    "email": f"test_{int(time.time())}@sih.com",
    "password": "password123"
}

# Signup
r_reg = requests.post(f"{AUTH_BASE}/users", json=test_user)
report("User Signup (Spring Boot)", r_reg.status_code, r_reg.text)

# Login
r_log = requests.post(f"{AUTH_BASE}/login", json={
    "username": test_user["username"],
    "password": test_user["password"]
})
report("User Login (Spring Boot)", r_log.status_code, r_log.text)

# 2. AI LEGAL FEATURES (Flask + Llama)
print("\n--- [SECTION 2: AI LEGAL POWER] ---")

# Hindi Chatbot
r_chat = requests.post(f"{AI_BASE}/chat", json={
    "message": "What is Article 14?",
    "lang": "Hindi"
})
report("Hindi AI Legal Assistant", r_chat.status_code, r_chat.text)

# Verdict Predictor
r_verd = requests.post(f"{AI_BASE}/predict_verdict", json={
    "scenario": "I was fired without notice after 5 years.",
    "lang": "English"
})
report("AI Verdict Predictor (PRO)", r_verd.status_code, r_verd.text)

# Legal Drafter
r_draft = requests.post(f"{AI_BASE}/generate_draft", json={
    "scenario": "Police Encounter RTI",
    "lang": "Hindi"
})
report("AI Legal Drafter (RTI Generator)", r_draft.status_code, r_draft.text)

# 3. INTERACTIVE ENGINE
print("\n--- [SECTION 3: INTERACTIVE ENGINE] ---")

# Story Engine
r_story = requests.post(f"{AI_BASE}/storynext", json={
    "caseTitle": "Daily Life: Workplace Equality",
    "currentStep": 0,
    "history": [],
    "userChoice": "",
    "lang": "English"
})
report("Storytelling Engine", r_story.status_code, r_story.text)

# 4. COMMUNITY PULSE
print("\n--- [SECTION 4: COMMUNITY PULSE] ---")
r_pulse = requests.post(f"{AI_BASE}/sentiment", json={
    "text": "This judgment is unfair to the common man!",
    "lang": "English"
})
report("Social-Legal Sentiment Analyst", r_pulse.status_code, r_pulse.text)

print("\nAUDIT COMPLETE")
