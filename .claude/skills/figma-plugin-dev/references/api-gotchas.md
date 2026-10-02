# Plugin API gotchas

Pitfalls that come up in almost every plugin. Each one says what goes wrong and what to do. For deeper patterns on variables, text styles, components and auto layout, see `.claude/skills/figma-use/references/gotchas.md` and its `*-patterns.md` files, but skip the MCP-only helpers listed in the main skill.

## Contents
- Dynamic page loading (async APIs)
- Text and fonts
- Traversal performance
- Selection and document events
- Writing to the document: undo, positioning, sizing
- Mixed values
- Variables, styles and components
- Network requests
- Storage: clientStorage vs pluginData
- Closing and notifying
- Main-thread limits

## Dynamic page loading (async APIs)

The template sets `"documentAccess": "dynamic-page"`, which Figma requires for new plugins. Only the current page is loaded, so synchronous lookups throw errors like `Cannot call with documentAccess: dynamic-page. Use figma.getNodeByIdAsync() instead`.

| Instead of | Use |
|---|---|
| `figma.getNodeById(id)` | `await figma.getNodeByIdAsync(id)` |
| `figma.getStyleById(id)` | `await figma.getStyleByIdAsync(id)` |
| `figma.variables.getVariableById(id)` | `await figma.variables.getVariableByIdAsync(id)` |
| `figma.variables.getLocalVariables()` | `await figma.variables.getLocalVariablesAsync()` |
| `instance.mainComponent` | `await instance.getMainComponentAsync()` |
| `figma.currentPage = page` | `await figma.setCurrentPageAsync(page)` |
| `figma.root.findAll(...)` on other pages | `await figma.loadAllPagesAsync()` first, or `await page.loadAsync()` for one page |

Loading every page is slow on large files, so do it only when the feature really needs the whole document.

## Text and fonts

- Before changing `characters`, font size, or any text property, load every font the node uses: `await Promise.all(node.getRangeAllFontNames(0, node.characters.length).map(figma.loadFontAsync))`. Otherwise you get `Cannot write to node with unloaded font`.
- `node.hasMissingFont` is true when a font isn't available to the user. Skip or report those nodes; you can't edit them.
- `loadFontsAsync(nodes)` from `@create-figma-plugin/utilities` loads fonts for a list of text nodes.
- New text nodes default to Inter Regular. Load it before setting `characters`.

## Traversal performance

Large files have tens of thousands of nodes, and the main thread blocks the editor while your code runs.
- Prefer `node.findAllWithCriteria({ types: ['TEXT'] })` over `findAll` with a type check in the callback; it's much faster.
- Set `figma.skipInvisibleInstanceChildren = true` when hidden instance children don't matter. It makes traversal and lookups noticeably faster.
- Scope searches to the selection or a known frame, not `figma.root`.
- For long jobs, process in chunks and `await` between them so the UI can show progress and the editor stays responsive.

## Selection and document events

- `figma.on('selectionchange', fn)` fires on every selection change. Send only what the UI needs (count, ids, names), not whole node trees.
- `figma.on('currentpagechange', fn)` fires when the user switches pages. Refresh any page-scoped state.
- `figma.on('documentchange', fn)` requires `loadAllPagesAsync()` first under dynamic-page. Use it sparingly; it fires a lot.
- Selections can be empty, mixed types, or very large. Design every handler for all three.

## Writing to the document: undo, positioning, sizing

- Figma groups changes into one undo step per plugin run by default. Call `figma.commitUndo()` after each logical action in a long-running plugin so Cmd+Z undoes one action, not everything.
- New nodes are created at (0, 0) on the current page. Position them deliberately, or append them inside a frame, and use `figma.viewport.scrollAndZoomIntoView(nodes)` to show the result.
- `width` and `height` are read-only. Use `node.resize(w, h)`.
- Fills, strokes and effects are immutable arrays. Clone, modify, and reassign: `node.fills = [...]`.
- `instance.detachInstance()` returns a new frame, and ids of its children change.

## Mixed values

Properties like `fontSize`, `fills` or `cornerRadius` can return `figma.mixed` (a unique symbol) when values vary across a node or text range. Check `value === figma.mixed` before using the value; the UI kit's `MIXED_NUMBER`, `MIXED_STRING` and `MIXED_BOOLEAN` constants represent the same idea in controls.

## Variables, styles and components

- `node.boundVariables` holds variable aliases (`{ type: 'VARIABLE_ALIAS', id }`). Resolve them with `getVariableByIdAsync` to get names, collections and values.
- A variable's value is per mode (`variable.valuesByMode[modeId]`), and the value can itself be an alias to another variable. Follow aliases when you need the final value, but keep the original name when the goal is code handoff.
- Style ids (`fillStyleId`, `textStyleId`) can be `figma.mixed` on text nodes and an empty string when no style is applied.
- Remote library components and styles need `importComponentByKeyAsync` / `importStyleByKeyAsync` before you can use them.

## Network requests

- Every domain must be listed in `networkAccess.allowedDomains`; anything else is blocked. Keep `["none"]` when the plugin doesn't use the network.
- `fetch` is available in main and in the UI. The UI iframe has a `null` origin, so it can only call APIs that send `Access-Control-Allow-Origin: *`. Use a proxy you control for APIs that don't.
- Put local dev servers in `devAllowedDomains`, and write a clear `reasoning` when using wildcards or before publishing.
- Never embed secret API keys in plugin code. Users can read the bundle.

## Storage: clientStorage vs pluginData

| Need | Use |
|---|---|
| User preferences, last-used options | `loadSettingsAsync` / `saveSettingsAsync` (wrap `figma.clientStorage`; per user, per plugin, about 5 MB) |
| Data attached to a node, private to this plugin | `node.setPluginData(key, value)` |
| Data attached to a node, readable by other plugins | `node.setSharedPluginData(namespace, key, value)` |
| A button on a node that reopens the plugin | `node.setRelaunchData({ commandKey: 'description' })` plus a `relaunchButtons` entry in the manifest config |

Plugin data is stored in the file and visible to collaborators. Don't store anything sensitive there.

## Closing and notifying

- `figma.closePlugin(message?)` ends the run and closes the UI. Code after it does not run reliably. Await pending work first.
- `figma.notify(message, { error: true })` shows a toast. Use it for headless commands or quick confirmations. When the UI is open, show the result in the UI instead of in a toast that disappears.
- A plugin without UI must call `closePlugin()` when done, or it keeps running with a spinner in the editor.

## Main-thread limits

- No DOM, `window`, `document`, `localStorage`, `setTimeout`-based animation, or image decoding in main. Do canvas and image work in the UI and send bytes back as a `Uint8Array`.
- `figma.createImage(bytes)` takes PNG, JPG or GIF bytes and returns an `Image` whose `hash` goes into an `IMAGE` paint.
- `node.exportAsync({ format: 'PNG' | 'SVG' | 'PDF' | 'JPG' })` returns bytes. Send them to the UI to download or upload.
