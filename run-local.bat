@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo [Qalam Canvas] Node.js and npm are required.
  echo Install Node.js, then run this file again.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo [Qalam Canvas] Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo [Qalam Canvas] Dependency installation failed.
    pause
    exit /b 1
  )
)

echo [Qalam Canvas] Starting at http://localhost:3000
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:3000'"
call npm run dev

if errorlevel 1 (
  echo.
  echo [Qalam Canvas] The development server stopped with an error.
  pause
)

endlocal
