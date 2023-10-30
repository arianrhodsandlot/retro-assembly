import { teardown } from '../../../core'
import { useRouterHelpers } from './use-router-helpers'

export function useTeardown() {
  const { navigateToHome } = useRouterHelpers()

  async function teardown_() {
    await teardown()
    navigateToHome()
  }

  return { teardown: teardown_ }
}
