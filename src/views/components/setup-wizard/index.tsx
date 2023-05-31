import { useAtomValue } from 'jotai'
import { needsRegrantLocalPermissionAtom, needsShowGetStartedAtom } from '../../lib/atoms'
import { GetStarted } from './get-started'
import { Header } from './header'
import { RegrantLocalPermission } from './regrant-local-permission'

export default function SetupWizard({ onSubmit }: { onSubmit: () => void }) {
  const needsGrantLocalPermission = useAtomValue(needsRegrantLocalPermissionAtom)
  const needsShowGetStarted = useAtomValue(needsShowGetStartedAtom)

  return (
    <div className='text-red-600'>
      <Header />
      {needsGrantLocalPermission ? <RegrantLocalPermission /> : null}
      {needsShowGetStarted ? <GetStarted /> : null}
    </div>
  )
}
