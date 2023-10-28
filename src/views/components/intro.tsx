import { noop } from 'lodash-es'
import { BaseDialogContent } from './primitives/base-dialog-content'
import SetupWizard from './setup-wizard'

export function Intro() {
  return (
    <BaseDialogContent open={false}>
      <SetupWizard onSetup={noop} />
    </BaseDialogContent>
  )
}
