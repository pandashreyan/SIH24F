// Central API configuration
// Change BASE_URL to your machine's IP when running on a real device
// Use '10.0.2.2' for Android Emulator (maps to localhost on host machine)
// Use your actual LAN IP (e.g. '192.168.x.x') for a physical device

const BASE_URL = 'http://localhost:8080';

// Flask/AI services - using localhost with adb reverse
const CHATBOT_URL = 'http://localhost:5000/chat';
const GENERATE_URL = 'http://localhost:5000/generate';

const API = {
  BASE_URL,
  // Auth
  LOGIN: `${BASE_URL}/api/login`,
  REGISTER: `${BASE_URL}/api/users`,
  DELETE_USER: (username) => `${BASE_URL}/api/users/${username}`,
  // AI features
  SENTIMENT: `http://localhost:5000/sentiment`,
  RESPONSES: `${BASE_URL}/api/responses`,
  // AI services
  CHATBOT: CHATBOT_URL,
  GENERATE: GENERATE_URL,
  STORY_NEXT: `http://localhost:5000/storynext`,
};

export default API;
