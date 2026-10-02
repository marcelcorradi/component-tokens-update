# Manifest configuration

With create-figma-plugin you never edit `manifest.json`. It is generated on every build from the `"figma-plugin"` key in `package.json` and is git-ignored. Edit `package.json`, then run `npm run build`. The `.vscode/settings.json` schema gives autocomplete for these keys.

## Template default

```json
"figma-plugin": {
  "editorType": ["figma"],
  "id": "figma-plugin-template",
  "name": "Plugin Template",
  "main": "src/main.ts",
  "ui": "src/ui.tsx",
  "documentAccess": "dynamic-page",
  "networkAccess": { "allowedDomains": ["none"] }
}
```

When starting a new plugin from the template, change `name`, and change `id` to something unique. Figma assigns the real id when you first publish; during development any unique string works, and a reused id would collide with another imported dev plugin. Also update the root `name` and `description` in `package.json`.

## Keys you will reach for

| Key | What it does | Notes |
|---|---|---|
| `editorType` | `figma`, `figjam`, `dev`, `slides` | Add `dev` for a Dev Mode plugin; it usually also needs `capabilities` |
| `main` / `ui` | Entry files for a single-command plugin | Omit `ui` for a headless command |
| `menu` | Several commands, each with its own `main`/`ui`; `"-"` is a separator | Nested `menu` arrays create sub-menus |
| `parameters` | Inputs in Quick Actions, each with `key`, `name`, optional `description`, `allowFreeform`, `optional` | Main receives them through `figma.parameters.on('input', ...)` and the `run` event |
| `parameterOnly` | `false` lets a parameter command also open with no input | |
| `relaunchButtons` | Map of command key → `{ name, main, ui?, multipleSelection? }` | Pair with `node.setRelaunchData({ key: '...' })` |
| `documentAccess` | `"dynamic-page"` | Required for new plugins; see async API rules in api-gotchas.md |
| `networkAccess` | `allowedDomains`, `devAllowedDomains`, `reasoning` | `["none"]` means no network; `reasoning` is required for wildcards and for publishing |
| `permissions` | e.g. `"currentuser"`, `"activeusers"`, `"fileusers"`, `"payments"`, `"teamlibrary"` | Passed through to the manifest; ask only for what the feature uses, and confirm the current list in Context7 |
| `capabilities` | `"codegen"`, `"inspect"`, `"textreview"`, `"vscode"` | Codegen also needs `codegenLanguages` |
| `enableProposedApi` | Allows proposed APIs during development | Plugins using it can't be published |
| `enablePrivatePluginApi` | Allows private-plugin-only APIs | For org-private plugins |

## Multiple commands

```json
"figma-plugin": {
  "editorType": ["figma"],
  "id": "my-plugin",
  "name": "Organize Layers",
  "documentAccess": "dynamic-page",
  "networkAccess": { "allowedDomains": ["none"] },
  "menu": [
    { "name": "Organize Layers", "main": "src/organize/main.ts", "ui": "src/organize/ui.tsx" },
    "-",
    { "name": "Reset Settings", "main": "src/reset/main.ts" }
  ],
  "relaunchButtons": {
    "organize": { "name": "Organize Layers", "main": "src/organize/main.ts", "ui": "src/organize/ui.tsx" }
  }
}
```

When a plugin has several commands, give each command its own folder with `main.ts` and `ui.tsx`, and keep the shared code in `src/shared/`.

## Customizing the build

`build-figma-plugin` uses esbuild. To extend it, add `build-figma-plugin.main.js` or `build-figma-plugin.ui.js` at the root, exporting a function that takes the default `buildOptions` and returns modified options. Only do this when the default build can't handle a need, such as a loader for an unusual file type.

CSS modules (`*.module.css`) work out of the box and generate `*.css.d.ts` typings, which are git-ignored. Keep them for the rare layout needs the UI kit can't cover, and use the theme variables listed in `figma-plugin-ui-design/references/components.md`.

Confirm keys you haven't used before against Context7 (`/yuanqing/create-figma-plugin`, query "configuration") because Figma adds manifest fields over time.
