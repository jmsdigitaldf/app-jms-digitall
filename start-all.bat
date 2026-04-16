@echo off
REM Script para iniciar Frontend e Backend juntos no Windows

echo.
echo ======================================
echo    JMS Digitall - Iniciando Servi%ços
echo ======================================
echo.

echo Iniciando Backend na porta 3000...
start cmd /k "cd backend && pnpm dev"

echo.
echo Aguardando 3 segundos antes de iniciar Frontend...
timeout /t 3 /nobreak

echo.
echo Iniciando Frontend na porta 8080...
start cmd /k "pnpm dev"

echo.
echo ======================================
echo Servi%ços iniciados!
echo.
echo Frontend:  http://localhost:8080
echo Backend:   http://localhost:3000/api
echo Health:    http://localhost:3000/health
echo ======================================
echo.
pause
