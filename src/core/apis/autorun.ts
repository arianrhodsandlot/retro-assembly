import { OneDriveProvider } from '../classes/file-system-providers/one-drive-provider'
import { emitter } from '../helpers/emitter'

async function run() {
  if (OneDriveProvider.isRetrievingToken()) {
    emitter.emit('onedrive-token', 'start')
    try {
      await OneDriveProvider.dectectRedirect()
      emitter.emit('onedrive-token', 'success')
    } catch (error) {
      console.error(error)
      emitter.emit('onedrive-token', 'error')
    }
  }
}

try {
  await run()
} catch (error) {
  console.error(error)
}
