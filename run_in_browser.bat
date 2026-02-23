@echo off
cd /d "%~dp0"
echo.
echo ==================================================
echo   Starting Transport App in Web Browser...
echo ==================================================
echo.
echo NOTE: Data saved in the Browser is SEPARATE from the Desktop App.
echo.
echo Starting Server...
cmd /c "npx http-server -c-1 -o"
pause
