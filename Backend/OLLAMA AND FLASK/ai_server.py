from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2:latest"

SYSTEM_PROMPT = "You are an expert on the Indian Constitution. Provide accurate, educational responses."

def query_ollama(prompt: str, system: str = SYSTEM_PROMPT, lang: str = "English") -> str:
    # Force language in system prompt
    full_system = f"{system}\nIMPORTANT: Respond ONLY in {lang}."
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": f"[SYSTEM]: {full_system}\n\n[USER]: {prompt}\n\n[ASSISTANT]:",
        "stream": False,
        "options": {
            "temperature": 0.4, 
            "num_predict": 250, 
            "num_ctx": 1024
        }
    }
    response = requests.post(OLLAMA_URL, json=payload, timeout=300)
    return response.json().get("response", "").strip()

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    reply = query_ollama(data["message"], lang=data.get("lang", "English"))
    return jsonify({"response": reply})

@app.route("/sentiment", methods=["POST"])
def sentiment():
    data = request.get_json()
    lang = data.get("lang", "English")
    sys = f"Legal Analyst. Return ONLY JSON in {lang}: {{'sentiment': '...', 'score': 0.8, 'summary': '...'}}"
    reply = query_ollama(f"Analyze: {data['text']}", system=sys, lang=lang)
    try:
        start = reply.find('{')
        end = reply.rfind('}') + 1
        return jsonify(json.loads(reply[start:end]))
    except:
        return jsonify({"sentiment": "Neutral", "score": 0.5, "summary": reply[:100]})

@app.route("/storynext", methods=["POST"])
def story_next():
    data = request.get_json()
    case = data.get("caseTitle", "Case")
    step = data.get("currentStep", 0)
    choice = data.get("userChoice", "")
    lang = data.get("lang", "English")
    
    sys = f"Part {step} of {case}. User: {choice}. Be brief. Mention Articles. Respond in {lang}."
    reply = query_ollama(f"Context: {data.get('history', [])[-1:]}", system=sys, lang=lang)
    return jsonify({"response": reply, "step": step + 1})

@app.route("/generate_draft", methods=["POST"])
def generate_draft():
    # ... existing code ...
    data = request.get_json()
    scenario = data.get("scenario", "Legal Matter")
    lang = data.get("lang", "English")
    
    sys = f"Professional legal drafter. Respond in {lang}. Generate template for: {scenario}."
    reply = query_ollama("Create draft.", system=sys, lang=lang)
    return jsonify({"draft": reply})

@app.route("/predict_verdict", methods=["POST"])
def predict_verdict():
    data = request.get_json()
    text = data.get("scenario", "")
    lang = data.get("lang", "English")
    
    sys = f"""You are a Supreme Court Mock Judge. 
    Analyze the scenario and return ONLY JSON in {lang}:
    {{
      "probability": 0-100,
      "verdict": "Likely Winner",
      "shield": "Main Article protecting user",
      "sword": "Main legal challenge",
      "logic": "1-sentence legal reasoning"
    }}"""
    
    reply = query_ollama(f"Scenario: {text}", system=sys, lang=lang)
    try:
        start = reply.find('{')
        end = reply.rfind('}') + 1
        return jsonify(json.loads(reply[start:end]))
    except:
        return jsonify({"probability": 50, "verdict": "Uncertain", "shield": "Art 21", "sword": "Evidence", "logic": "Needs more detail"})

if __name__ == "__main__":
    print("="*30)
    print(" NEW AI SERVER STARTING ")
    print(" Port: 5000 ")
    print("="*30)
    app.run(host="0.0.0.0", port=5000, debug=False)
