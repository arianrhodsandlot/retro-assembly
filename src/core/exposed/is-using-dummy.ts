import { DummyProvider } from '../classes/file-system-providers/dummy-provider'
import { globalContext } from '../internal/global-context'

export function isUsingDummy() {
  return globalContext.fileSystem instanceof DummyProvider
}
