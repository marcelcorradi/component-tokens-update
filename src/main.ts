import { emit, loadSettingsAsync, on, once, saveSettingsAsync, showUI } from '@create-figma-plugin/utilities'

import {
  AddPrefixHandler,
  CloseHandler,
  DEFAULT_SETTINGS,
  PrefixAddedHandler,
  SelectionChangedHandler,
  SETTINGS_KEY,
  Settings,
  UiProps
} from './shared/types'

export default async function () {
  const settings = await loadSettingsAsync<Settings>(DEFAULT_SETTINGS, SETTINGS_KEY)

  on<AddPrefixHandler>('ADD_PREFIX', async function (prefix: string) {
    const nodes = figma.currentPage.selection
    for (const node of nodes) {
      node.name = `${prefix}${node.name}`
    }
    await saveSettingsAsync<Settings>({ prefix }, SETTINGS_KEY)
    emit<PrefixAddedHandler>('PREFIX_ADDED', nodes.length)
  })

  once<CloseHandler>('CLOSE', function () {
    figma.closePlugin()
  })

  figma.on('selectionchange', function () {
    emit<SelectionChangedHandler>('SELECTION_CHANGED', figma.currentPage.selection.length)
  })

  const props: UiProps = {
    selectionCount: figma.currentPage.selection.length,
    settings
  }
  showUI({ height: 236, title: 'Plugin Template', width: 280 }, props)
}
