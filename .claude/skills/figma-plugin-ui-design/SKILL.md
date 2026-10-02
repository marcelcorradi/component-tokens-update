---
name: figma-plugin-ui-design
description: Design guidance for Figma plugin interfaces built with @create-figma-plugin/ui. It adapts the frontend-design philosophy (start from the subject, make deliberate choices, show restraint, write useful copy, critique your own work) to a surface where Figma owns the colors and type. Covers flow, information hierarchy, states, copy, window sizing, and a library-first component rule with a full v4 component catalog. Use it whenever you design, build, review or polish the UI of a Figma or FigJam plugin, including ui.tsx, panels, settings, empty, error and success states, button labels, or the question "which component should I use", even if the user only says "make the plugin screen better".
---

# Figma plugin UI design

Approach this as the design lead for a tool that lives inside another tool. Your users are in the middle of their own work in Figma; the plugin should feel like a well-made part of the editor that knows exactly what it's for, not like a small website that opened in a window.

The frontend-design skill's core idea still applies: make deliberate, opinionated choices for this specific brief instead of templated defaults. What changes is where those choices go. Figma owns the color palette, the typeface, and the look of every control, and the UI kit follows the user's light or dark theme. That's a feature: the plugin looks native for free. Your design freedom moves to what's on screen, in what order, with what words, at what density, and what happens on the canvas.

## Ground the design in the job

Before designing, write down (and confirm with the user if the brief doesn't say):
- **Who** opens this plugin and **at what moment** in their work. A designer cleaning up layer names before handoff is in a different state of mind than a design-system lead auditing token usage across a file.
- **The one job** the plugin does. Most good plugins do one job and are judged on how fast and safely they do it.
- **The input**: the current selection, the whole page, a file the user uploads, or text they type.
- **The output**: changes on the canvas, something to copy, a file to download, or information to read.
- **How often** it runs. A plugin used twenty times a day should remember settings and run with one click or the Enter key. A once-a-month audit can afford to explain itself more.

Those answers decide density, number of steps, defaults, and which moment deserves craft.

## What you design

| Figma decides | You decide |
|---|---|
| Colors, typeface, type scale | What appears on each screen, and in what order |
| What controls look like | Which control expresses each choice (see the catalog) |
| Light/dark theme | Defaults, and which options stay hidden until needed |
| | Window size, and whether it changes per screen |
| | Every word: title, labels, helper text, button names, status messages |
| | Empty, loading, error, success and partial states |
| | What happens on the canvas: select results, zoom to them, notify |
| | The one moment that gets extra care |

The canvas is part of your UI. Selecting and zooming to the 12 layers you just renamed often confirms an action better than any message in the panel.

## Generic plugin tells

These patterns appear in plugin after plugin no matter what the plugin does. They are defaults, not choices, so avoid them unless the brief calls for them:
- A header that repeats the plugin name and a marketing tagline. The window title already shows the name; use the space for the current state ("12 layers selected").
- Settings before purpose: a wall of checkboxes before the user knows what the plugin will do. Lead with the input and the main action; put advanced options in a `Disclosure`.
- A bordered card around every section. In an 11px UI, spacing groups better than boxes, and nested borders make a small window feel cramped.
- Raw JSON in a monospace block as the main result. Show a summary people can read, and offer the raw output through copy or download.
- Vague buttons such as "Run", "Submit", "Go" or "Generate".
- A blank window, or a disabled button with no explanation, when nothing is selected.
- The same outcome reported twice, in a toast and in a banner.
- ALL CAPS section labels, emoji as icons, and decorative dividers between every block.

## Library-first rule

Build the UI from `@create-figma-plugin/ui` components and layout primitives. Read [references/components.md](references/components.md) for the full v4 catalog with props and a "need → component" table.

Why this matters: the library's components already handle keyboard behavior, focus rings, disabled states, Figma's exact sizing, and both themes. A hand-built `<button>` or a `div` with hardcoded hex colors looks wrong in dark mode and drifts from Figma with every UI update. In the earlier spec-figma project, inline-styled section boxes and a raw `window.onmessage` handler slipped in exactly because nobody checked what the library offered.

For every element, decide in this order:
1. Find the closest library component in the catalog and use it with its props.
2. If nothing fits, try composing existing components and layout primitives (`Stack`, `Columns`, `Inline`, `MiddleAlign`, `VerticalSpace`).
3. If the need truly isn't covered, stop and tell the user what is missing, which components you checked, and what the custom option would be (a CSS module using only the theme variables in the catalog). Continue once they agree.

Report gaps concretely, for example: "The library has `TextboxMultiline` but no read-only code viewer with syntax highlighting. I can show the output in `TextboxMultiline` with a copy `IconButton`, or build a small CSS-module panel with `--figma-color-bg-secondary` and `--font-family-code`. Which do you prefer?"

Native HTML controls (`button`, `input`, `select`, `textarea`) and inline `style` objects with hardcoded values don't belong in plugin UI. Plain `div` wrappers are fine when a layout primitive doesn't fit.

## Process: plan, review against the brief, build, critique

### 1. Plan

Write a short UI plan before any code:
- **Job and moment**: one sentence each.
- **Flow**: the screens or states in order. Aim for the fewest steps that keep the action safe.
- **Wireframe**: an ASCII sketch at the real window width (often 280–360px) with real copy, not lorem ipsum.
- **Component map**: each element → the catalog component that renders it.
- **States**: empty selection, unsupported selection, loading, success, partial success, error, and very large input. For each, say what the user sees and what they can do next.
- **Copy deck**: title, labels, helper text, button names, messages.
- **Window size**: width and height per screen, and whether it resizes.
- **The memorable thing**: the one place that gets extra craft. It might be an instant preview, a smart default that makes the plugin usable in one click, a result that selects itself on the canvas, or an empty state that teaches the plugin in one line.

```text
280px ┌──────────────────────────────┐
      │ Add a prefix to layer names  │  Text+Bold
      │ 12 layers selected           │  Text+Muted (live)
      │                              │
      │ Prefix                       │  Text+Muted
      │ [ icon/                    ] │  Textbox
      │                              │
      │ [  Add prefix  ] [  Close  ] │  Columns: Button, Button secondary
      └──────────────────────────────┘
```

### 2. Review the plan against the brief

Ask: would I have produced this exact plan for any plugin? If a part of it is generic (the header, the layout, the copy, the states), change that part to fit this plugin's job and users, and say what you changed and why. Then build.

### 3. Build

Follow the plan and use `figma-plugin-dev` for the code conventions (typed events, initial data through `showUI`, settings). Keep UI state explicit, for example `'idle' | 'working' | 'done' | 'error'`, so every state in the plan has a clear place in the code.

### 4. Critique

Before presenting the UI, check it the way a picky Figma user would:
- **Hierarchy**: is the main action obvious? Is each section title closer to its own content than to the previous section? Does helper text sit right under the control it explains?
- **Rhythm**: do equivalent groups use the same spacing? Are gaps between sections clearly larger than gaps inside them?
- **States**: does the screen still read cleanly in the empty, error, loading and success states? Do 0, 1, and 5,000 selected layers all behave?
- **Noise**: are any labels repeated ("Output", "Result", "Markdown" side by side)? Is there helper text that explains the obvious, or more dividers than regions?
- **Native feel**: does it read like part of Figma? Check both light and dark themes, keyboard use (Tab order, Enter for the main action where it's safe), and long layer names.
- **Cut one thing**: remove one element that isn't earning its place.

Say plainly what you could not check without running the plugin in Figma, and any quality issue you know is still open.

## Writing in plugin UI

Words in a plugin are part of the interface, and in an 11px UI every word costs space.
- Name things the way Figma users already do: layers, frames, components, variants, variables, styles, pages. Say "selection", not "input nodes".
- Buttons say exactly what happens: "Add prefix", "Export 3 frames", "Replace colors". Keep the same verb through the flow, so "Add prefix" leads to "Prefix added to 12 layers".
- Empty states tell the user what to do: "Select the frames you want to export." They don't just say that nothing is selected.
- Errors say what happened and how to fix it, in the interface's voice and without apologizing: "3 text layers use fonts that aren't installed, so they were skipped."
- Use sentence case and plain verbs. Each piece of text does one job.
- Write the UI in the user's language if the brief says so. Otherwise use English, which matches Figma's own UI.

## Quality floor

Meet these without announcing them: works in light and dark themes, full keyboard access with visible focus (the library provides this), no layout jumps when states change, long names truncate instead of breaking the layout, the window size fits its content without an unexpected scrollbar, and the plugin remembers the user's last settings when that saves them work.
