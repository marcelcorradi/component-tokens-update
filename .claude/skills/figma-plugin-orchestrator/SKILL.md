---
name: figma-plugin-orchestrator
description: Entry point and workflow for building Figma plugins in this template, from idea to a plugin that builds and can be imported into Figma. It runs the brief, docs check, architecture, UI plan, implementation and verification, and loads the right skill for each phase (figma-plugin-dev, figma-plugin-ui-design, context7, figma-use, find-skills). Use it whenever the user wants to create, start, extend, redesign, debug or ship a Figma, FigJam or Dev Mode plugin or widget, or describes a tool that should run inside Figma ("I want something that renames my layers", "a plugin to export tokens"), even if they never say "plugin".
---

# Figma plugin orchestrator

This repository is a starter for Figma plugins. It ships a minimal plugin that builds (`src/main.ts`, `src/ui.tsx`, `src/shared/types.ts`), using create-figma-plugin v4 and `@create-figma-plugin/ui`. Your job is to take the user from an idea to a plugin they can run in Figma, by working through the phases below and loading the specialist skill each phase needs.

| Skill | Load it when |
|---|---|
| `figma-plugin-dev` | Writing or changing any plugin code: architecture, events, `figma.*` calls, manifest, storage |
| `figma-plugin-ui-design` | Planning, building or reviewing anything the user sees in the plugin window |
| `context7` (or the Context7 MCP tools) | Before relying on any API you haven't verified this session |
| `figma-use` | Inspecting or preparing a real Figma file through the Figma MCP (`use_figma`), e.g. building a test file or checking what the plugin produced. Not for writing plugin source code. |
| `find-skills` | The plugin needs knowledge outside these skills (image processing, i18n, an external API, charts) |

## Phase 1: Brief

Turn the request into a short brief and confirm it with the user before writing code. A wrong assumption here costs the most later. Propose defaults so the user only has to correct what is wrong:

- **Job**: what the plugin does, in one sentence.
- **Users and moment**: who runs it, and when in their work.
- **Editor**: Figma design (default), FigJam, Dev Mode, or Slides.
- **Commands**: one command (default), or several menu entries, Quick Actions parameters, relaunch buttons.
- **UI**: a window (default) or headless (runs and closes with a toast).
- **Input and output**: selection, page, or file in; canvas changes, copy, download, or information out.
- **Network**: none (default), or which domains and why.
- **Persistence**: which settings to remember between runs.

If the user has already answered these in conversation, don't ask again. Write the brief down and move on.

## Phase 2: Check the docs

List the APIs the brief needs (for example variables, `exportAsync`, text editing, relaunch data) and check each one in Context7 before designing around it. Use the library IDs listed in `figma-plugin-dev`. Training data goes stale; the template's own version pins (Preact 10, TypeScript 5) exist because "latest" broke the build.

If a needed API doesn't exist, needs a permission, or is limited (for example only available in Dev Mode, or blocked by `dynamic-page`), tell the user now and adjust the brief.

## Phase 3: Architecture

Load `figma-plugin-dev`. Decide:
- the events between main and ui (one `EventHandler` per event in `src/shared/types.ts`)
- the shape of the data passed through `showUI` and the saved settings
- the folder split, if the plugin will outgrow the three starter files
- the manifest changes in `package.json` (`name`, a unique `id`, `menu`, `networkAccess`, and so on)

Start from the template's starter code. Replace the example "add prefix" behavior rather than building beside it, and rename the plugin in `package.json`.

## Phase 4: UI plan

Load `figma-plugin-ui-design` and write its UI plan (job, flow, ASCII wireframe, component map, states, copy, window size, the memorable thing). Show the plan to the user when the UI is more than a single simple screen; a wireframe is much cheaper to change than code.

Headless plugins skip the wireframe but still need their copy: the `figma.notify` messages and the errors.

## Phase 5: Implement in thin slices

Build one end-to-end slice first (one event from UI to main and back, with the real UI), run `npm run build`, and only then add the next slice. Errors stay small and local this way, and the user can import the plugin early.

Keep the rules from both skills while coding: typed events only, async node APIs, library components only, theme variables only in the rare CSS module.

## Phase 6: Verify

Follow the verification list in `figma-plugin-dev`:
1. `npm run build` and `npm run lint` pass.
2. The generated `manifest.json` matches the brief.
3. Do the critique pass from `figma-plugin-ui-design` on the final UI.
4. Give the user the steps to run it: Figma desktop → Plugins → Development → Import plugin from manifest… → this repo's `manifest.json`; keep `npm run watch` running while iterating.
5. Optionally, if the Figma MCP is connected, use `figma-use` to set up a test file with the cases that matter (empty frames, text with missing fonts, many layers) so the user can try the plugin against them.

Report results honestly: what passed, what you could not test outside Figma, and known limits.

## Phase 7: Wrap up

Update the project `README.md` with what the plugin does, its commands, and how to run it. If the user keeps a changelog, add an entry.

## When to stop and ask

- The brief is ambiguous about what the plugin changes in the document. Destructive edits need explicit agreement on scope.
- The UI needs something the component library doesn't cover (see the library-first rule).
- An API needed for the job is missing, limited, or needs a permission or network access the user hasn't approved.
- The user asks for a different stack. Explain the trade-off first (see `figma-plugin-dev`).

## Evolving this template

When a plugin teaches you something reusable, such as an API gotcha, a component pattern, or a common mistake, suggest adding it to the matching skill or reference file so the next plugin benefits. Use `skill-creator` if the user wants to test or refine a skill.
