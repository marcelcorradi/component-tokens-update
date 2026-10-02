import {
  Banner,
  Bold,
  Button,
  Columns,
  Container,
  IconCheck24,
  Muted,
  render,
  Stack,
  Text,
  Textbox,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import {
  AddPrefixHandler,
  CloseHandler,
  PrefixAddedHandler,
  SelectionChangedHandler,
  UiProps
} from './shared/types'

function layerCount(count: number) {
  return count === 1 ? '1 layer' : `${count} layers`
}

function Plugin(props: UiProps) {
  const [selectionCount, setSelectionCount] = useState(props.selectionCount)
  const [prefix, setPrefix] = useState(props.settings.prefix)
  const [renamedCount, setRenamedCount] = useState<number | null>(null)

  useEffect(function () {
    const offSelectionChanged = on<SelectionChangedHandler>('SELECTION_CHANGED', function (count) {
      setSelectionCount(count)
      setRenamedCount(null)
    })
    const offPrefixAdded = on<PrefixAddedHandler>('PREFIX_ADDED', setRenamedCount)
    return function () {
      offSelectionChanged()
      offPrefixAdded()
    }
  }, [])

  const canAddPrefix = selectionCount > 0 && prefix !== ''

  return (
    <Container space="medium">
      <VerticalSpace space="large" />
      <Stack space="extraSmall">
        <Text>
          <Bold>Add a prefix to layer names</Bold>
        </Text>
        <Text>
          <Muted>
            {selectionCount === 0
              ? 'Select the layers you want to rename.'
              : `${layerCount(selectionCount)} selected`}
          </Muted>
        </Text>
      </Stack>
      <VerticalSpace space="large" />
      <Stack space="small">
        <Text>
          <Muted>Prefix</Muted>
        </Text>
        <Textbox onValueInput={setPrefix} placeholder="icon/" value={prefix} />
      </Stack>
      <VerticalSpace space="large" />
      <Stack space="small">
        {renamedCount !== null && (
          <Banner icon={<IconCheck24 />} variant="success">
            Prefix added to {layerCount(renamedCount)}
          </Banner>
        )}
        <Columns space="extraSmall">
          <Button
            disabled={!canAddPrefix}
            fullWidth
            onClick={function () {
              emit<AddPrefixHandler>('ADD_PREFIX', prefix)
            }}
          >
            Add prefix
          </Button>
          <Button
            fullWidth
            onClick={function () {
              emit<CloseHandler>('CLOSE')
            }}
            secondary
          >
            Close
          </Button>
        </Columns>
      </Stack>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
