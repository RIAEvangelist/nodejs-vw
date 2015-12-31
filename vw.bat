@echo off
for /f "tokens=1,* delims= " %%a in ("%*") do set ARGS=%%b
"%windir%\system32\vw-cmd.bat" %ARGS%