@echo off
title SwarmStudio Launcher
echo ==========================================================
echo              SWARMSTUDIO CREATIVE PLATFORM
echo ==========================================================
echo.

echo [1/3] Starting FastAPI Backend on http://127.0.0.1:8000...
start "SwarmStudio Backend" cmd /k "cd /d "%~dp0backend" && venv\Scripts\python.exe run.py"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Vite React Frontend on http://localhost:5173...
start "SwarmStudio Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 2 /nobreak >nul

echo [3/3] Launching web browser...
start http://localhost:5173

echo.
echo SwarmStudio is now running!
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo.
pause
