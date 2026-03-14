---
name: memory-update
description: Update long-term memory by writing lessons learned to the persistent memory file. Use this skill whenever the user says "remember this", "save this lesson", "update memory", "add to lessons", or when you discover an important insight about user preferences, project conventions, debugging patterns, or behavioral corrections that should persist across sessions. Also use when the user asks to view, list, or remove existing lessons.
---

# Memory Update

Persist and manage lessons learned across sessions by reading/writing `.rsp/shared/memory/lessons.md`.

## When to use

- User explicitly asks you to remember something
- User corrects your behavior and the correction should persist
- You discover a project convention that wasn't previously recorded
- User asks to view, edit, or remove existing lessons

## Memory file

Path: `.rsp/shared/memory/lessons.md` (relative to workspace root)

Each line is a lesson in this format:

```
- [Category]: Lesson content here.
```

Valid categories: `Behavior`, `TypeScript`, `React`, `Project`, `Debug`, `Convention`, `Preference`, `Architecture`

## Adding a lesson

1. Read the current `.rsp/shared/memory/lessons.md` to check for duplicates or contradictions
2. If the new lesson contradicts an existing one, replace the old line (the user's latest preference wins)
3. Append the new lesson using the format above
4. Confirm to the user what was saved

**Example interaction:**

User: "Remember that I prefer functional components over class components in React"

→ Read `.rsp/shared/memory/lessons.md`
→ Check no existing lesson says the opposite
→ Append: `- [React]: Prefer functional components over class components.`
→ Reply: "Saved to long-term memory: prefer functional components over class components in React."

## Removing or editing a lesson

1. Read `.rsp/shared/memory/lessons.md`
2. Show the user the matching lesson(s)
3. Remove or edit the line as requested
4. Write back the updated file
5. Confirm the change

## Viewing lessons

If the user asks "what do you remember" or "show me lessons", read and display the contents of `.rsp/shared/memory/lessons.md`.

## Rules

- Never add duplicate lessons — check before writing
- When a new lesson contradicts an old one, replace the old one
- Keep lessons concise — one actionable sentence per line
- Always pick the most specific applicable category
- Do not add lessons unless the user explicitly requests it or you've identified a clear behavioral correction
