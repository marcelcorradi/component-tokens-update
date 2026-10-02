import { EventHandler } from '@create-figma-plugin/utilities'

export type Settings = {
  prefix: string
}

export const SETTINGS_KEY = 'settings'

export const DEFAULT_SETTINGS: Settings = {
  prefix: ''
}

// Data passed from main to the UI through showUI(); arrives as the Plugin component's props.
export type UiProps = {
  selectionCount: number
  settings: Settings
}

// UI -> main
export interface AddPrefixHandler extends EventHandler {
  name: 'ADD_PREFIX'
  handler: (prefix: string) => void
}

export interface CloseHandler extends EventHandler {
  name: 'CLOSE'
  handler: () => void
}

// main -> UI
export interface SelectionChangedHandler extends EventHandler {
  name: 'SELECTION_CHANGED'
  handler: (selectionCount: number) => void
}

export interface PrefixAddedHandler extends EventHandler {
  name: 'PREFIX_ADDED'
  handler: (renamedCount: number) => void
}
