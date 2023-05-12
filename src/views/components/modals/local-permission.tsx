import { useAtom } from 'jotai'
import { system } from '../../../core'
import { needsGrantLocalPermissionAtom } from '../../lib/atoms'
import { Modal } from './modal'

export default function LocalPermission({ onSubmit }: { onSubmit: () => void }) {
  const [needsGrantLocalPermission] = useAtom(needsGrantLocalPermissionAtom)

  async function grantLocalPermission() {
    try {
      await system.grantPermissionManually()
      onSubmit()
    } catch {}
  }

  return (
    <Modal isOpen={needsGrantLocalPermission}>
      <button onClick={grantLocalPermission}>grant</button>
    </Modal>
  )
}
