import { isUsingDropbox, isUsingGoogleDrive, isUsingLocal, isUsingOnedrive, start } from '../../../../core'
import { useAsyncExecute } from '../../hooks/use-async-execute'
import { useRouterHelpers } from '../../hooks/use-router-helpers'
import { HomeScreen } from '../library/platform/home-screen'
import { Intro } from './intro'

export function Home() {
  const { navigateToLibrary } = useRouterHelpers()

  const [state] = useAsyncExecute(async () => {
    if (isUsingOnedrive()) {
      navigateToLibrary('onedrive')
    } else if (isUsingGoogleDrive()) {
      navigateToLibrary('google-drive')
    } else if (isUsingDropbox()) {
      navigateToLibrary('dropbox')
    } else if (isUsingLocal()) {
      navigateToLibrary('local')
    } else {
      await start('public')
      return { showHome: true }
    }
  })

  if (state.result?.showHome) {
    return (
      <>
        <HomeScreen />
        <Intro />
      </>
    )
  }
}
