#!/bin/bash

MEMORY_FILE=".rsp/shared/memory/lessons.md"

if [ -s "$MEMORY_FILE" ]; then
    LESSONS=$(head -n 50 "$MEMORY_FILE" | sed 's/\\/\\\\/g; s/"/\\"/g; s/\t/\\t/g' | awk '{printf "%s\\n", $0}')
    cat <<JSON
{
  "continue": true,
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "## Long-term Memory (Lessons Learned)\\nThe following lessons were saved from previous sessions. Follow them strictly unless the user explicitly overrides one.\\n\\n${LESSONS}"
  }
}
JSON
else
    echo '{"continue": true}'
fi
