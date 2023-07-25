import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { getSupportedFileExtensions, isCloudServiceEnabled, isLocalDirectorySelectorEnabled } from '../../../core'
import { SpatialNavigation } from '../../lib/spatial-navigation'
import { BaseButton } from '../primitives/base-button'
import { BaseDialogContent } from '../primitives/base-dialog-content'
import { BaseTooltip } from '../primitives/base-tooltip'
import { isInvalidDialogOpenAtom } from './atoms'
import { DirectoryInstruction } from './directory-instruction'
import { DropboxButton } from './dropbox-button'
import { GoogleDriveButton } from './google-drive-button'
import { LocalButton } from './local-button'
import { LocalFileButton } from './local-file-button'
import { OnedriveButton } from './onedrive-button'

const isOnedriveEnabled = isCloudServiceEnabled('onedrive')
const isGoogleDriveEnabled = isCloudServiceEnabled('google-drive')
const isDropboxEnabled = isCloudServiceEnabled('dropbox')
const isAnyCloudServiceEnabled = isOnedriveEnabled || isGoogleDriveEnabled

const directoryInstruction = <DirectoryInstruction />
const directoryInstructionToolTip = (
  <BaseTooltip
    tooltipContent={
      <div className='z-[2] max-w-lg rounded border border-rose-700 bg-white p-6'>{directoryInstruction}</div>
    }
  >
    <span className='icon-[mdi--help-circle-outline] relative -top-1 h-4 w-4' />
  </BaseTooltip>
)
const supportedFileExtensions = getSupportedFileExtensions()
const fileInstructionToolTip = (
  <BaseTooltip
    tooltipContent={
      <div className='z-[2] max-w-sm rounded border border-rose-700 bg-white p-6'>
        <div>We currently support ROM files with these file extensions:</div>
        <div className=' leading-loose'>
          {[...supportedFileExtensions].sort().map((extension) => {
            return (
              <pre className='mr-2 mt-2 inline-block rounded bg-rose-100 px-2 text-sm text-rose-700' key={extension}>
                {extension}
              </pre>
            )
          })}
        </div>
        <div className='mt-2'>
          or a <pre className='inline-block rounded bg-rose-100 px-2 text-sm text-rose-700'>zip</pre> file containing
          one with above extensions.
        </div>
      </div>
    }
  >
    <span className='icon-[mdi--help-circle-outline] relative -top-1 h-4 w-4' />
  </BaseTooltip>
)

export function GetStarted() {
  const [isInvalidDialogOpen, setIsInvalidDialogOpenAtom] = useAtom(isInvalidDialogOpenAtom)

  useEffect(() => {
    SpatialNavigation.focus()
  }, [])

  return (
    <div className='container m-auto max-w-5xl px-10 text-rose-700'>
      <div className='get-started w-full rounded-xl border-2 border-rose-700 px-10 py-6'>
        <div className='flex flex-col items-center gap-10'>
          {isAnyCloudServiceEnabled ? (
            <div className='flex flex-col items-center'>
              <div className='flex items-center justify-center gap-2 text-center font-bold'>
                <span className='icon-[mdi--cube-outline] h-6 w-6' />
                Select a cloud directory
                {directoryInstructionToolTip}
              </div>
              <div className='mt-2 flex items-start justify-center text-xs'>
                <span className='icon-[mdi--thumb-up] mr-2 mt-1 h-3 w-3' />
                <div>Synchronize your games and saves across multiple devices.</div>
              </div>
              <div className='mt-4 flex w-60 flex-col justify-between gap-y-3'>
                {isOnedriveEnabled ? <OnedriveButton /> : null}
                {isGoogleDriveEnabled ? <GoogleDriveButton /> : null}
                {isDropboxEnabled ? <DropboxButton /> : null}
              </div>
            </div>
          ) : null}

          {isLocalDirectorySelectorEnabled() ? (
            <div>
              <div className='flex items-center justify-center gap-2 text-center font-bold'>
                <span className='icon-[mdi--cube-outline] h-6 w-6' />
                Select a local directory
                {directoryInstructionToolTip}
              </div>
              <div className='mt-2 flex items-center justify-center text-xs'>A simple way to try Retro Assembly.</div>
              <div className='mt-4 flex justify-center'>
                <LocalButton />
              </div>
            </div>
          ) : null}

          <div>
            <div className='flex items-center justify-center gap-2 text-center font-bold'>
              <span className='icon-[mdi--cube-outline] h-6 w-6' />
              Select a local file
              {fileInstructionToolTip}
            </div>
            <div className='mt-2 flex items-center justify-center text-xs'>
              Just play your ROMs, without setting up, instantly.
            </div>
            <div className='mt-4 flex justify-center'>
              <LocalFileButton />
            </div>
          </div>
        </div>

        <div className='m-auto mt-10 px-12 text-rose-200' hidden>
          <div className='flex items-center font-bold'>
            <span className='icon-[mdi--bell] mr-2 h-4 w-4' />
            Notice:
          </div>
          <div className='mt-2 pl-6'>
            The directory you choose should match a certain structure:
            <br />
            The ROMs of retro games should be grouped in seperate directories, and the directories should be named in
            these conviention:
            <ul className='list-disc pl-4'>
              <li className='list-item'>NES/Famicom - nes</li>
              <li className='list-item'>SNES/Super Famicom - snes</li>
            </ul>
          </div>
        </div>
      </div>

      <BaseDialogContent closable onOpenChange={setIsInvalidDialogOpenAtom} open={isInvalidDialogOpen}>
        <div className='max-w-lg'>
          <div className='flex items-center text-lg font-bold'>
            <span className='icon-[mdi--alert] mr-2 h-5 w-5 text-yellow-400' />
            <h3>You selected an invalid directory as your ROMs directory</h3>
          </div>

          <div className='mt-4'>{directoryInstruction}</div>

          <div className='mt-4 text-center'>
            <BaseButton className='m-auto' onClick={() => setIsInvalidDialogOpenAtom(false)} styleType='primary'>
              <span className='icon-[mdi--hand-okay] h-5 w-5' />
              OK
            </BaseButton>
          </div>
        </div>
      </BaseDialogContent>
    </div>
  )
}
