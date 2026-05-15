"""
Nagrik Aur Samvidhan - Flask AI Service
SIH 2024 Project

This Flask app serves as the AI middleware between the React Native frontend
and the Ollama LLM (running locally or on Google Colab via ngrok).

Endpoints:
  POST /chat    — Chatbot: answers constitutional queries
  POST /generate — Story generator for FightCase screen

To run locally:
  pip install flask flask-cors requests
  python flask_server.py

To run on Google Colab with ngrok:
  See instructions in /OLLAMA AND FLASK/FLASK_springboot.ipynb
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import logging

app = Flask(__name__)
CORS(app)  # Allow all origins (React Native)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ─── Ollama Configuration ────────────────────────────────────────────────────
# When running locally: use http://localhost:11434
# When running on Colab: Ollama runs there, just expose this Flask via ngrok
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2:latest"  # Exact match for the installed model

SYSTEM_PROMPT = """You are an expert on the Indian Constitution and legal system.
You help citizens understand their rights, duties, and the workings of democracy.
Provide accurate, educational, and engaging responses. Use simple language."""


def query_ollama(prompt: str, system: str = SYSTEM_PROMPT) -> str:
    """Send a prompt to the local Ollama instance and return the response."""
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": f"[SYSTEM]: {system}\n\n[USER]: {prompt}\n\n[ASSISTANT]:",
        "stream": False,
        "options": {
            "temperature": 0.7,
            "top_p": 0.9,
            "num_predict": 1024,
        }
    }
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=120)
        response.raise_for_status()
        data = response.json()
        return data.get("response", "").strip()
    except requests.exceptions.ConnectionError:
        raise RuntimeError("Ollama server is not running. Start it with: ollama serve")
    except requests.exceptions.Timeout:
        raise RuntimeError("Ollama request timed out. The model may be loading.")
    except Exception as e:
        raise RuntimeError(f"Ollama error: {str(e)}")


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "model": OLLAMA_MODEL}), 200


@app.route("/chat", methods=["POST"])
def chat():
    """
    Chatbot endpoint for the AI Legal Assistant screen.

    Request body:
        { "message": "What are Fundamental Rights?" }

    Response:
        { "response": "Fundamental Rights are..." }
    """
    data = request.get_json(silent=True)
    if not data or "message" not in data:
        return jsonify({"error": "Missing 'message' field"}), 400

    user_message = data["message"].strip()
    if not user_message:
        return jsonify({"error": "Message cannot be empty"}), 400

    logger.info(f"[CHAT] User: {user_message[:100]}")

    try:
        reply = query_ollama(user_message)
        logger.info(f"[CHAT] Bot: {reply[:100]}")
        return jsonify({"response": reply}), 200
    except RuntimeError as e:
        logger.error(f"[CHAT] Error: {e}")
        return jsonify({"error": str(e)}), 503


@app.route("/generate", methods=["POST"])
def generate():
    """
    Story generation endpoint for the Interactive Storytelling (FightCase) screen.
    Takes a detailed case prompt and returns a structured narrative.

    Request body:
        { "input": "<detailed_case_prompt>" }

    Response:
        { "output": "<narrative_with_#_delimiters>" }
    """
    data = request.get_json(silent=True)
    if not data or "input" not in data:
        return jsonify({"error": "Missing 'input' field"}), 400

    prompt = data["input"].strip()
    if not prompt:
        return jsonify({"error": "Input cannot be empty"}), 400

    logger.info(f"[GENERATE] Input length: {len(prompt)} chars")

    story_system = """You are a legal storyteller specializing in Indian constitutional cases.
Create engaging, educational narratives about legal cases. Split your response into exactly 4 parts
using the '#' symbol as a delimiter. Each part should present case proceedings followed by a
thought-provoking question for the reader."""

    try:
        output = query_ollama(prompt, system=story_system)
        # Ensure we have at least one '#' delimiter
        if '#' not in output:
            # Add artificial splits if model didn't follow instructions
            paragraphs = output.split('\n\n')
            mid = max(1, len(paragraphs) // 4)
            sections = [
                ' '.join(paragraphs[i*mid:(i+1)*mid])
                for i in range(4)
            ]
            output = '#'.join(filter(None, sections))

        logger.info(f"[GENERATE] Output length: {len(output)} chars")
        return jsonify({"output": output}), 200
    except RuntimeError as e:
        logger.error(f"[GENERATE] Error: {e}")
        return jsonify({"error": str(e)}), 503
@app.route("/sentiment", methods=["POST"])
def sentiment():
    """
    Sentiment Analysis endpoint.
    Request body: { "text": "..." }
    """
    data = request.get_json(silent=True)
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400

    text = data["text"].strip()
    sentiment_system = """You are an expert at legal sentiment analysis. 
    Analyze the text and return JSON with:
    - 'sentiment': (one of: Positive, Negative, Neutral)
    - 'score': (a decimal from 0 to 1)
    - 'summary': (a 1-sentence explanation)
    Return ONLY the JSON."""

    try:
        reply = query_ollama(f"Analyze this text: {text}", system=sentiment_system)
        # Try to parse JSON from the LLM output
        try:
            res_json = json.loads(reply)
            return jsonify(res_json), 200
        except:
            return jsonify({"sentiment": "Neutral", "score": 0.5, "raw": reply}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 503


@app.route("/storynext", methods=["POST"])
def story_next():
    """
    Turn-based storytelling endpoint.
    Request body: { "caseTitle": "...", "currentStep": 0, "history": [...], "userChoice": "..." }
    """
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Missing data"}), 400

    case_title = data.get("caseTitle", "a constitutional case")
    current_step = data.get("currentStep", 0)
    history = data.get("history", [])
    user_choice = data.get("userChoice", "")

    story_system = f"""You are a legal storyteller. You are guiding the user through the landmark case: {case_title}.
    Rules:
    1. If this is Step 0: Introduce the facts of the case and end with a 'What would you decide?' question.
    2. If Step > 0: First, briefly react to the user's previous choice ('{user_choice}') by comparing it to the actual legal logic. Then, move to the next phase of the case.
    3. Always end with a thought-provoking question for the user to decide on.
    4. On the final step (Step 3), provide the actual verdict and a concluding summary.
    Keep each part under 100 words."""

    prompt = f"We are at step {current_step}. History of our story so far: {history}. User's last choice: {user_choice}."
    
    try:
        reply = query_ollama(prompt, system=story_system)
        return jsonify({"response": reply, "step": current_step + 1}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 503


# ─── Main ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("=" * 60)
    print("  Nagrik Aur Samvidhan - Flask AI Service")
    print("  SIH 2024 Project")
    print("=" * 60)
    print(f"  Ollama Model : {OLLAMA_MODEL}")
    print(f"  Ollama URL   : {OLLAMA_URL}")
    print(f"  Flask Server : http://0.0.0.0:5000")
    print("=" * 60)
    print("  Endpoints:")
    print("    GET  /health   — Health check")
    print("    POST /chat     — AI Chatbot")
    print("    POST /generate — Story Generator")
    print("    POST /story/next — Turn-based Storyteller")
    print("    POST /sentiment — Legal Sentiment Analysis")
    print("=" * 60)
    app.run(host="0.0.0.0", port=5000, debug=False)
