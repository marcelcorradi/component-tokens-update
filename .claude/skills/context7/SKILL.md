---
name: context7
description: |
  Fetch up-to-date library documentation via Context7 API. Use PROACTIVELY when:
  (1) Working with ANY external library (React, Next.js, Supabase, etc.)
  (2) User asks about library APIs, patterns, or best practices
  (3) Implementing features that rely on third-party packages
  (4) Debugging library-specific issues
  (5) Need current documentation beyond training data cutoff
  (6) AND MOST IMPORTANTLY, when you are installing dependencies, libraries, or frameworks you should ALWAYS check the docs to see what the latest versions are. Do not rely on outdated knowledge.
  Always prefer this over guessing library APIs or using outdated knowledge.
---

# Context7 Documentation Fetcher

Retrieve current library documentation via Context7 API.

If Context7 MCP tools (`resolve-library-id`, `query-docs`) are available in the session, prefer them — they need no key. Use this script as the fallback.

The script reads `CONTEXT7_API_KEY` from `.claude/skills/context7/.env` (a hidden file, git-ignored; copy `.env.example` to create it) or from the environment. If the key is missing, tell the user instead of guessing APIs.

## Workflow

### 1. Search for the library

```bash
python .claude/skills/context7/scripts/context7.py search "<library-name>"
```

Example:
```bash
python .claude/skills/context7/scripts/context7.py search "next.js"
```

Returns library metadata including the `id` field needed for step 2.

### 2. Fetch documentation context

```bash
python .claude/skills/context7/scripts/context7.py context "<library-id>" "<query>"
```

Example:
```bash
python .claude/skills/context7/scripts/context7.py context "/vercel/next.js" "app router middleware"
```

Options:
- `--type txt|md` - Output format (default: txt)
- `--tokens N` - Limit response tokens

## Quick Reference

| Task | Command |
|------|---------|
| Find React docs | `search "react"` |
| Get React hooks info | `context "/facebook/react" "useEffect cleanup"` |
| Find Supabase | `search "supabase"` |
| Get Supabase auth | `context "/supabase/supabase" "authentication row level security"` |

## When to Use

- Before implementing any library-dependent feature
- When unsure about current API signatures
- For library version-specific behavior
- To verify best practices and patterns
