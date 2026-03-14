@echo off
setlocal enabledelayedexpansion

set "MEMORY_FILE=.rsp\shared\memory\lessons.md"

if not exist "%MEMORY_FILE%" (
    echo {"continue": true}
    goto :eof
)

set "LESSONS="
set /a LINECOUNT=0
for /f "usebackq delims=" %%L in ("%MEMORY_FILE%") do (
    set /a LINECOUNT+=1
    if !LINECOUNT! leq 50 (
        set "LESSONS=!LESSONS!%%L\n"
    )
)

echo {
echo   "continue": true,
echo   "hookSpecificOutput": {
echo     "hookEventName": "SessionStart",
echo     "additionalContext": "## Long-term Memory (Lessons Learned)\nFollow these past lessons strictly unless the user explicitly overrides one.\n\n!LESSONS!"
echo   }
echo }

endlocal
