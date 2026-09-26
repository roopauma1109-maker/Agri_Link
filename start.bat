@echo off
echo ===================================================
echo Starting AgriLink Platform Servers...
echo ===================================================

echo [1/2] Launching Backend Server on http://localhost:8000 ...
start "AgriLink Backend" cmd /k "cd /d %~dp0backend && python main.py"

echo [2/2] Launching Frontend Server on http://localhost:5173 ...
start "AgriLink Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo ===================================================
echo AgriLink application starting up!
echo Open http://localhost:5173 in your browser.
echo ===================================================
