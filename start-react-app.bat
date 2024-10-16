@echo off
setlocal
cd %~dp0
echo Starting React app...
start "" "http://localhost:3000"
npx serve -s build
pause
