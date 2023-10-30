import { isUsingDropbox, isUsingGoogleDrive, isUsingLocal, isUsingOnedrive, start } from '../../../core'
import { HomeScreen } from '../home-screen'
import { useRouterHelpers } from '../home-screen/hooks'
import { useAsyncExecute } from '../hooks'
import { Intro } from '../intro'

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
