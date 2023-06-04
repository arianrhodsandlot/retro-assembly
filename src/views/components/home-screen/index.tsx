import { useAsync } from 'react-use'
import { system, ui } from '../../../core'
import { GameEntryContainer } from './game-entry-container'

export function HomeScreen() {
  const state = useAsync(async () => {
    await new Promise((resolve) => system.onStarted(resolve))
    const groupedRoms = await ui.listRoms()

    if (!Object.keys(groupedRoms)) {
      // todo: needs better user experience
      throw new Error('empty dir')
    }

    return groupedRoms
  })

  return <GameEntryContainer groupedRoms={state.value} loading={state.loading} />
}
