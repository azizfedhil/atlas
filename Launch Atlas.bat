@echo off
rem Double-click to start the Cosmossi Atlas in its own window.
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install the LTS version from https://nodejs.org , then double-click this file again.
  pause
  exit /b 1
)
rem The server runs in a minimised window and stops by itself when you close the atlas. If it fails, the window stays open to show why.
start "Cosmossi Atlas server" /min cmd /c "node tools\serve.mjs || pause"
