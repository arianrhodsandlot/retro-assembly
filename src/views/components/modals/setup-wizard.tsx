import { CloudIcon, FolderOpenIcon } from '@heroicons/react/24/outline'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { system } from '../../../core'
import { needsSetupAtom } from '../../lib/atoms'
import { GeneralSettings } from '../settings-forms/directory-settings'
import { Modal } from './modal'

function getCurrentGeneralSettings() {
  return {
    romProviderType: system.preference.get('romProviderType'),
    handle: undefined,
  }
}

export default function SetupWizard({ onSubmit }: { onSubmit: () => void }) {
  const [needsSetup] = useAtom(needsSetupAtom)
  const [generalSettings, setGeneralSettings] = useState(getCurrentGeneralSettings())

  async function onChange(value) {
    const { romProviderType, handle, romDirectory } = value
    if (romProviderType !== generalSettings.romProviderType) {
      system.setFileSystemProviderType(romProviderType)
    }

    if (romProviderType === 'local') {
      await system.updateSettings({ fileSystem: 'local', directory: '', handle })
    } else if (romProviderType === 'onedrive') {
      await system.updateSettings({ fileSystem: 'onedrive', directory: romDirectory })
    }

    setGeneralSettings(getCurrentGeneralSettings())
    onSubmit()
  }

  async function selectLocalDirectory() {
    try {
      // @ts-expect-error `showDirectoryPicker` is not defined in ts's default declaration files
      const handle = await showDirectoryPicker({ mode: 'readwrite' })
      await system.updateSettings({ fileSystem: 'local', directory: '', handle })
    } catch {}
    onSubmit()
  }

  if (!needsSetup) {
    return null
  }

  return (
    <div className='absolute inset-0 z-10 bg-white text-red-600'>
      <div className='m-auto mt-40 w-[800px]'>
        <div className='text-center'>
          <h3>
            <span className='text-3xl' style={{ fontFamily: "'Press Start 2P', cursive" }}>
              Retro
              <br />
              Assembly
            </span>
          </h3>
          <div className='mt-4'>A retro game console application built for your browser</div>
        </div>

        <div className='mt-10'>To get started, you can:</div>

        <div className='-ml-10 mt-4 box-content w-full rounded-xl border-2 border-red-600 px-10 py-6'>
          <div className='mt-4'>
            <button
              className='rounded border-2 border-red-600 bg-white px-4 py-2 text-red-600'
              onClick={selectLocalDirectory}
            >
              <FolderOpenIcon className='mr-2 inline-block h-4 w-4' />
              select a local directory
            </button>
            <div className='mt-1 text-xs'>A simple way to try Retro Assembly.</div>
          </div>

          <div className='mt-4'>or</div>

          <div className='mt-4'>
            <button className='rounded border-2 border-red-600 bg-white px-4 py-2 text-red-600'>
              <CloudIcon className='mr-2 inline-block h-4 w-4' />
              select a directory from OneDrive
            </button>
            <div className='mt-1 text-xs'>
              This is the recommended selection, since you can sync your games and progress seamlessly.
            </div>
          </div>

          <div className='mt-4 text-sm'>
            Notice: The directory you choose should match a certain structure: your roms of retro games should be
            grouped in seperate directories, and the directories should be named in these conviention:
            <ul>
              <li>
                {`NES/Famicom roms should be placed in a directory whose name contains "nes" or "Nintendo - Nintendo
      Entertainment System".`}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
