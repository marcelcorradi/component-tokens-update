# @create-figma-plugin/ui v4 catalog

Taken from the installed `@create-figma-plugin/ui` 4.0.3 type definitions. If the installed version changes, re-check with `grep "export" node_modules/@create-figma-plugin/ui/lib/index.d.ts` and read a component's props in `node_modules/@create-figma-plugin/ui/lib/components/<name>/<name>.d.ts`.

All components import from `@create-figma-plugin/ui`. Controls follow the same pattern: `value` plus `onValueInput` (text) or `onValueChange` (choices and booleans).

## Contents
- Layout
- Text
- Actions
- Inputs
- Choices
- Lists and disclosure
- Feedback
- Overlays and files
- Icons
- Hooks
- Theme variables (for the rare custom CSS)
- Need → component lookup

## Layout

Spacing values everywhere: `'extraSmall' | 'small' | 'medium' | 'large' | 'extraLarge'`.

| Component | Props | Use |
|---|---|---|
| `Container` | `space` | Horizontal page padding. Wrap the whole UI in one. |
| `VerticalSpace` | `space` | Gap between blocks. Use bigger gaps between sections than inside them. |
| `Stack` | `space` | Vertical list with even gaps (label + control, a group of checkboxes). |
| `Columns` | `space?` | Equal-width horizontal split (two buttons side by side). |
| `Inline` | `space?` | Horizontal run that wraps (tags, small buttons). |
| `MiddleAlign` | — | Center content in the available space (empty or loading screens). |
| `Divider` | — | Full-width rule between unrelated regions. Use it rarely; space usually separates better. |

## Text

| Component | Props | Use |
|---|---|---|
| `Text` | `align?: 'left' \| 'center' \| 'right'`, `numeric?` | Every piece of text goes in a `Text`. `numeric` gives tabular figures. |
| `Bold` | — | Inside `Text`, for titles and section headings. |
| `Muted` | — | Inside `Text`, for labels, helper text and secondary info. |
| `Code` | — | Inside `Text`, for monospace values such as ids, token names or code. |
| `Link` | `href`, `target?`, `fullWidth?` | External links (docs, help). |

There is no heading component. A heading is `<Text><Bold>…</Bold></Text>`; hierarchy comes from weight, muted color and spacing, because the whole UI uses Figma's 11px type scale.

## Actions

| Component | Props | Use |
|---|---|---|
| `Button` | `onClick`, `secondary?`, `danger?`, `disabled?`, `loading?`, `fullWidth?` | One primary button per screen; the rest `secondary`. `danger` for destructive actions. `loading` while main works. |
| `IconButton` | `onClick`, `disabled?`, children = icon | Compact toolbar actions (copy, refresh, settings). Pair with a `title` attribute so it has a tooltip and an accessible name. |
| `IconToggleButton` | `value`, `onValueChange`, children = icon | On/off tool states (lock, show hidden). |

## Inputs

| Component | Key props | Use |
|---|---|---|
| `Textbox` | `value`, `onValueInput`, `placeholder?`, `icon?`, `password?`, `validateOnBlur?`, `revertOnEscapeKeyDown?` | Single-line text. |
| `TextboxNumeric` | `value` (string), `onValueInput`, `onNumericValueInput`, `minimum?`, `maximum?`, `integer?`, `suffix?`, `incrementSmall?`, `incrementBig?`, `icon?` | Numbers. Supports arrow-key increments and math expressions like Figma's own fields. Keep the string and the parsed number in two states. |
| `TextboxMultiline` | `value`, `onValueInput`, `rows?`, `grow?`, `placeholder?` | Multi-line text, also usable as a read-only output area. |
| `TextboxColor` | `hexColor`, `opacity` (strings), `onHexColorValueInput`, `onOpacityValueInput`, `onRgbaColorValueInput` | Color + opacity, like the properties panel. |
| `TextboxAutocomplete` | `value`, `onValueInput`, `options`, `filter?`, `strict?`, `top?` | Text with suggestions (pick a font, a token, a page). |
| `SearchTextbox` | `value`, `onValueInput`, `placeholder?`, `clearOnEscapeKeyDown?` | Filter a list. |
| `RangeSlider` | `value` (string), `minimum`, `maximum`, `increment?`, `onValueInput` | Continuous values where feel matters more than precision. |

## Choices

| Component | Key props | Use |
|---|---|---|
| `Checkbox` | `value` (boolean or `MIXED_BOOLEAN`), `onValueChange`, children = label | Independent options. |
| `Toggle` | `value`, `onValueChange`, children = label | A setting that takes effect immediately. |
| `RadioButtons` | `options: { value, children?, disabled? }[]`, `value`, `onValueChange`, `direction?`, `space?` | 2–5 mutually exclusive choices that need labels. |
| `SegmentedControl` | `options: { value, children?, disabled? }[]`, `value`, `onValueChange` | 2–4 short mutually exclusive choices (format, size, mode). |
| `Dropdown` | `options` (`{ value, text?, disabled? }`, `{ header }`, `'-'`), `value`, `onValueChange`, `placeholder?`, `icon?` | Many choices, or when space is tight. |
| `Tabs` | `options: { value, children }[]`, `value`, `onValueChange` | Top-level views. `value` is the tab label, `children` is that tab's panel. |

## Lists and disclosure

| Component | Key props | Use |
|---|---|---|
| `Layer` | `value` (selected), `onValueChange`, `icon`, `description?`, `bold?`, `component?`, children = name | Rows that represent Figma layers, matching the layers panel. |
| `SelectableItem` | `value`, `onValueChange`, `bold?`, `indent?`, `disabled?` | Selectable rows in a list that aren't layers. |
| `Disclosure` | `title`, `open`, `onClick`, children | Collapsible section for advanced options. |

## Feedback

| Component | Key props | Use |
|---|---|---|
| `Banner` | `icon` (required), `variant?: 'success' \| 'warning'` | Inline status. No variant means neutral/info. There is no danger variant; use `warning` with copy that says what failed and how to fix it. |
| `LoadingIndicator` | `color?` | Spinner for loading screens. On buttons, use `Button loading` instead. |

## Overlays and files

| Component | Key props | Use |
|---|---|---|
| `Modal` | `open`, `title?`, `onCloseButtonClick?`, `onOverlayClick?`, `onEscapeKeyDown?`, `position?`, `transition?` | Confirmation or focused sub-task inside the plugin window. |
| `FileUploadButton` | `onSelectedFiles`, `acceptedFileTypes?`, `multiple?`, `loading?`, `secondary?`, `fullWidth?` | Pick files. |
| `FileUploadDropzone` | `onSelectedFiles`, `acceptedFileTypes?`, `multiple?`, children | Drag-and-drop area for files. |

## Icons

v4 ships Figma's UI3 icon set in two sizes, named `Icon<Name>16` and `Icon<Name>24` (about 140 at 16px, about 630 at 24px). Examples: `IconCheck24`, `IconClose24`, `IconPlus24`, `IconMinus24`, `IconTrash24`, `IconCopySmall24`, `IconSearch24`, `IconSettings24`, `IconInfoSmall24`, `IconWarningSmall24`, `IconLink24`, `IconLockLocked24`, `IconEyeSmall24`, `IconHiddenSmall24`, `IconComponent24`, `IconFrame24`, `IconText24`, `IconImage24`, `IconChevronDown24`, `IconMore24`, `IconRestart24`.

List the exact names before using one, because the set changed between v3 and v4:

```bash
ls node_modules/@create-figma-plugin/ui/lib/icons/icon-24 | grep -i <word>
```

Icons accept a `color` prop from the `IconColor` palette (`'brand'`, `'danger'`, `'secondary'`, `'success'`, `'warning'`, …).

## Hooks

`useForm`, `useInitialFocus` (with `InitialFocus` to focus the first input on open), `useWindowKeyDown` (keyboard shortcuts such as Enter to run), `useWindowResize` (resizable plugin window), `useFocusTrap`, `useMouseDownOutside`, `useScrollableMenu`.

## Theme variables (for the rare custom CSS)

When a layout need has no component, for example a bordered group or a scrollable results panel, use a CSS module (`*.module.css`) with these variables and nothing hardcoded. They follow Figma's light and dark theme automatically.

- Color: `--figma-color-bg`, `-bg-secondary`, `-bg-tertiary`, `-bg-hover`, `-bg-selected`, `-bg-brand`, `-bg-danger`, `-bg-success`, `-bg-warning`; `--figma-color-text`, `-text-secondary`, `-text-tertiary`, `-text-brand`, `-text-danger`, `-text-success`, `-text-warning`, `-text-disabled`; `--figma-color-border`, `-border-strong`, `-border-selected`, `-border-brand`, `-border-danger`; `--figma-color-icon`, `-icon-secondary`, `-icon-tertiary`
- Space: `--space-extra-small`, `--space-small`, `--space-medium`, `--space-large`, `--space-extra-large` (also raw `--space-4` … `--space-32`)
- Shape: `--border-radius-2`, `-4`, `-6`, `-12`; `--border-width-1`; `--box-shadow`, `--box-shadow-menu`, `--box-shadow-modal`
- Type: `--font-family`, `--font-family-code`, `--font-size-11`, `--font-size-12`, `--font-weight-regular`, `--font-weight-bold`, `--line-height-16`

Use a CSS module class instead of an inline `style={{ … }}` object, so custom styling stays in one visible place and is easy to review.

## Need → component lookup

| Need | Reach for |
|---|---|
| Title + description | `Text` + `Bold`, then `Text` + `Muted`, inside `Stack space="extraSmall"` |
| Label above a control | `Text` + `Muted`, then the control, inside `Stack space="small"` |
| Main action + cancel | `Columns space="extraSmall"` with a `Button` and a `Button secondary` |
| Show generated output | `TextboxMultiline` (read-only by ignoring input) plus an `IconButton` with `IconCopySmall24` |
| Choose output format | `SegmentedControl` |
| Advanced settings | `Disclosure` |
| List of selected layers | `Layer` rows |
| Empty selection | `MiddleAlign` with `Text` + `Muted` that says what to select |
| Success or warning after an action | `Banner` with `variant` |
| Working | `Button loading`, or `MiddleAlign` + `LoadingIndicator` for full-screen loads |
| Grouped card or panel | No component. Use spacing first; if a boundary is really needed, use a CSS module with theme variables and tell the user it's custom. |
