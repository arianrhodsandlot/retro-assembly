import { teardown } from '../../../core'
import { useRouterHelpers } from './use-router-helpers'

export function useTeardown() {
  const { navigateToHome } = useRouterHelpers()

  async function teardownLocal() {
    await teardown()
    navigateToHome()
  }

  return { teardown: teardownLocal }
}
