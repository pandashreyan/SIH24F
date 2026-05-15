@echo off
title Nagrik Aur Samvidhan - Master Controller
echo [🏛️] Starting Nagrik Aur Samvidhan Platform...
echo [🛡️] SIH 2024 - Ready for Demo!
echo.

:: 1. Start Ollama
echo [1/4] Launching Ollama (Llama 3 Brain)...
start "Ollama - AI Engine" cmd /k "ollama run llama3"

:: 2. Start Spring Boot
echo [2/4] Launching Spring Boot (Auth Server)...
start "Spring Boot - Backend" cmd /k "cd Backend && mvnw spring-boot:run"

:: 3. Start Flask AI Server
echo [3/4] Launching Flask (AI Logic)...
start "Flask - AI Server" cmd /k "cd Backend\OLLAMA AND FLASK && python flask_server.py"

:: 4. Start Metro Bundler
echo [4/4] Launching Metro (Mobile App Bundler)...
start "Metro Bundler" cmd /k "npx react-native start"

:: 5. ADB Reverse
echo.
echo [!] Mapping phone ports (Ensure phone is plugged in via USB)...
adb reverse tcp:8080 tcp:8080
adb reverse tcp:5000 tcp:5000

echo.
echo [✅] ALL SYSTEMS GO!
echo [📱] You can now open the app on your phone or run:
echo     npx react-native run-android
echo.
pause
