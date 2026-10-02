---
name: figma-plugin-dev
description: Engineering guide for Figma plugins built with create-figma-plugin, covering the stack, the main/ui/shared architecture, typed events between the sandbox and the iframe, settings, manifest config in package.json, and Plugin API pitfalls (dynamic-page async APIs, fonts, traversal performance, network access). Use it whenever you write or change the code of a Figma or FigJam plugin, including main.ts, ui.tsx, message passing, figma.* calls, manifest fields, menu commands, relaunch buttons, persistence, or when you turn a console script into a real plugin. It is usually loaded by figma-plugin-orchestrator, but load it directly for any focused plugin coding task.
---

# Figma plugin engineering

This skill holds the engineering conventions for plugins in this template. UI design decisions live in `figma-plugin-ui-design`; the overall workflow lives in `figma-plugin-orchestrator`.

## Stack

| Concern | Default |
|---|---|
| Scaffold and bundler | `@create-figma-plugin/build` (`build-figma-plugin`, esbuild) |
| UI components | `@create-figma-plugin/ui` v4 |
| Helpers and messaging | `@create-figma-plugin/utilities` v4 |
| UI runtime | Preact 10 |
| Language | TypeScript 5 |
| API types | `@figma/plugin-typings` |

Why this stack: the UI kit mirrors Figma's own UI3 controls and follows the editor's light and dark theme automatically, and the build tool generates `manifest.json` from `package.json`, which removes a whole class of config drift. It keeps effort on the plugin's actual job.

Two version pins matter and are easy to break by "upgrading to latest":
- **Preact must stay on 10.x.** `@create-figma-plugin/ui` 4.0.3 types fail against Preact 11 (`JSXInternal` has no `HTMLAttributes`).
- **TypeScript must stay on 5.x.** `build-figma-plugin --typecheck` crashes with TypeScript 7 (`getCurrentDirectory` undefined).

Re-check both with Context7 and `npm view` before bumping anything. Switch stacks (React, Tailwind, shadcn, a different bundler) only when the user explicitly asks; say what they would lose (native look, theme sync, generated manifest) before doing it.

## Architecture

A plugin runs in two separate places that can only talk through messages:
- **main** (`src/main.ts` and `src/main/*`): runs in Figma's sandbox. It has the `figma` global and document access, but no DOM, no `window`, no `fetch` to arbitrary hosts, and no browser APIs.
- **ui** (`src/ui.tsx` and `src/ui/*`): runs in an iframe. It has the DOM and network (as the manifest allows), but no `figma` global.
- **shared** (`src/shared/*`): types used by both sides, such as event handler interfaces, settings shape, and data models. Shared code must not touch `figma` or the DOM.

The starter is `src/main.ts`, `src/ui.tsx` and `src/shared/types.ts`. As the plugin grows, split like this rather than letting either entry file become a monolith:

```text
src/
  main.ts            # entry: load settings, register handlers, showUI
  main/
    handlers/        # one function per incoming event
    extract/         # all Figma reads, returning plain data
    apply/           # all Figma writes
  ui.tsx             # entry: render(Plugin)
  ui/
    components/      # compositions of @create-figma-plugin/ui primitives
    screens/
    state/
  shared/
    types.ts         # EventHandler interfaces, Settings, UiProps
    model.ts         # plain-data models passed between sides
```

When a plugin reads from the document and produces output (specs, exports, reports), normalize Figma data into a plain intermediate model first, then derive every output (JSON, Markdown, UI preview) from that model. Output formats change faster than extraction logic, and a stable model keeps them from breaking each other.

## Messaging between main and ui

Use the typed event helpers from `@create-figma-plugin/utilities`. Don't use `figma.ui.postMessage`, `parent.postMessage` or `window.onmessage` directly: they are untyped, a raw `window.onmessage` assignment silently replaces other listeners, and the helpers already handle the envelope on both sides.

```ts
// src/shared/types.ts
import { EventHandler } from '@create-figma-plugin/utilities'

export interface ApplyHandler extends EventHandler {
  name: 'APPLY'
  handler: (options: Options) => void
}
```

```ts
// main
on<ApplyHandler>('APPLY', async function (options) { /* ... */ })
emit<ResultHandler>('RESULT', result)

// ui, inside useEffect, unsubscribing on cleanup
useEffect(function () {
  return on<ResultHandler>('RESULT', setResult)
}, [])
```

Conventions:
- One `EventHandler` interface per event, named `<Thing>Handler`, with the event name in `SCREAMING_SNAKE_CASE`.
- Arguments must be structured-cloneable: plain objects, arrays, strings, numbers, `Uint8Array`. Never send nodes; send ids and plain data.
- Use `once` for one-shot events like `CLOSE`, and `on` for repeatable ones.
- Report errors as events (`ERROR` with a message the user can act on). Don't let a rejected promise in main fail silently.

### Initial data and settings

- Pass the first render's data as the second argument of `showUI(options, data)`. It arrives as the props of the component given to `render(Plugin)`, so the UI never flashes an empty state while it waits for a message.
- Persist user preferences with `loadSettingsAsync(defaults, key)` and `saveSettingsAsync(settings, key)`. They wrap `figma.clientStorage`, which is per user and per plugin and not shared with collaborators.
- Data that belongs to the document (shared with everyone who opens the file) goes in `node.setPluginData` / `setSharedPluginData`, not in client storage.

## Plugin API essentials

Read [references/api-gotchas.md](references/api-gotchas.md) before writing non-trivial `figma.*` code. It covers dynamic-page async APIs, font loading, traversal performance, undo, selection events, network limits and storage choices.

Read [references/manifest-config.md](references/manifest-config.md) when adding menu commands, parameters, relaunch buttons, network domains, permissions or Dev Mode capabilities.

The source of truth for API signatures is `node_modules/@figma/plugin-typings/plugin-api.d.ts`. Grep it before using an API you are not sure about. The `typecheck` step catches misuse only if you use the real types; don't cast to `any` to get past an error.

### About the figma-use skill

The `figma-use` skill teaches the Plugin API as it runs inside the Figma MCP `use_figma` tool. Its `references/gotchas.md` and `*-patterns.md` files are valuable for standard API pitfalls (variables, text styles, components, auto layout). But some of its helpers, such as `node.query()`, `node.set()`, `figma.createAutoLayout()`, `node.placeholder` and `node.screenshot()`, exist only in that MCP runtime and are not in `@figma/plugin-typings`. Don't put them in plugin code; if the typecheck fails on one, that's why.

## Up-to-date docs

Check Context7 before relying on memory for any API you haven't verified in this session. Prefer the Context7 MCP tools; fall back to the `context7` skill script.

| Library ID | Use for |
|---|---|
| `/yuanqing/create-figma-plugin` | build config, utilities, UI components, recipes |
| `/websites/developers_figma_plugins` | Plugin API guides, manifest, dynamic loading |
| `/figma/plugin-typings` | exact type signatures |
| `/figma/plugin-samples` | official sample plugins |

## Converting a console script into a plugin

When the starting point is a snippet pasted into the Figma console:
- Move the pure data-collection logic into `src/main/extract/*`, returning plain data instead of logging.
- Drive it from a UI event instead of running on load.
- Show results in the UI and add copy or download actions where they help.
- Add states for an empty or unsupported selection and for missing data.
- Make it compatible with `documentAccess: "dynamic-page"` (async node lookups, see the gotchas reference).
- Widen what the script collects if the user's real goal needs more than the script does today.

## Verification

Before calling plugin work done:
1. `npm run build` passes. It typechecks, bundles, and regenerates `manifest.json`.
2. `npm run lint` passes.
3. The generated `manifest.json` has the expected `editorType`, `documentAccess`, `networkAccess` and menu.
4. Tell the user how to try it: Figma desktop app → Plugins → Development → Import plugin from manifest… → choose this repo's `manifest.json`, then run it from Plugins → Development. With `npm run watch` running, rerunning the plugin picks up new builds.
5. List what you could not verify without running it in Figma, such as behavior on large files or with specific selections.
