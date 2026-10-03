@echo off
cd /d "%~dp0"
echo ===================================================
echo     Iniciando Horta-na-Mao (Servidor Local)
echo ===================================================
echo.
echo Abrindo em http://localhost:5173 ...
start http://localhost:5173
npm run dev
pause
