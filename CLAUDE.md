# Figma plugin template

Starter for Figma plugins built with create-figma-plugin v4, `@create-figma-plugin/ui` and Preact.

## Working here

- For any plugin work (new plugin, feature, UI, bug), start with the `figma-plugin-orchestrator` skill. It runs the workflow and loads `figma-plugin-dev` (code) and `figma-plugin-ui-design` (UI) when each is needed.
- Check APIs with Context7 before relying on memory. Prefer the Context7 MCP tools; fall back to the `context7` skill.
- Talk to the user in Portuguese. Plugin UI copy is in English unless the brief says otherwise.

## Commands

- `npm run watch`: rebuild on change while testing in Figma
- `npm run build`: typecheck, minify and regenerate `manifest.json`
- `npm run lint`: typecheck only

## Layout

- `src/main.ts`: runs in Figma's sandbox (`figma` global, no DOM)
- `src/ui.tsx`: runs in the plugin iframe (Preact + `@create-figma-plugin/ui`)
- `src/shared/types.ts`: typed events, settings and props shared by both sides
- Plugin config lives in `package.json` under `"figma-plugin"`. `manifest.json` and `build/` are generated, so don't edit them.

## Version pins

Keep `preact` on 10.x and `typescript` on 5.x. `@create-figma-plugin/ui` 4.0.3 types break with Preact 11, and `build-figma-plugin --typecheck` crashes with TypeScript 7.
