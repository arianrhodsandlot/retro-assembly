import clsx from 'clsx'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { getSupportedFileExtensions, isCloudServiceEnabled, isLocalDirectorySelectorEnabled } from '../../../core'
import { SpatialNavigation } from '../../lib/spatial-navigation'
import { ConfigGamepadDialogContent } from '../home-screen/top-bar/config-gamepad-dialog-content'
import { ConfigKeyboardDialogContent } from '../home-screen/top-bar/config-keyboard-dialog-content'
import { BaseButton } from '../primitives/base-button'
import { BaseCallout } from '../primitives/base-callout'
import { BaseDialogContent } from '../primitives/base-dialog-content'
import { BaseDialogTrigger } from '../primitives/base-dialog-trigger'
import { BaseTooltip } from '../primitives/base-tooltip'
import { isInvalidDialogOpenAtom } from './atoms'
import { DemoButton } from './demo-button'
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

const youtubeVideoAutoPlaySrc = 'https://www.youtube.com/embed/5QNCsowNiE4?autoplay=1'

export function GetStarted() {
  const [isInvalidDialogOpen, setIsInvalidDialogOpenAtom] = useAtom(isInvalidDialogOpenAtom)
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [videoSrc, setVideoSrc] = useState('')

  function togglePlayVideo() {
    setIsPlayingVideo(!isPlayingVideo)
    setVideoSrc(isPlayingVideo ? '' : youtubeVideoAutoPlaySrc)
  }

  useEffect(() => {
    SpatialNavigation.focus()
  }, [])

  return (
    <div className='get-started container m-auto flex max-w-5xl flex-col px-4 text-rose-700'>
      <div className='my-6 flex flex-col items-center justify-center gap-4 sm:flex-row'>
        {isPlayingVideo ? (
          <BaseButton
            className='w-full px-20 py-4 text-lg font-semibold sm:w-auto'
            onClick={togglePlayVideo}
            styleType='primary'
          >
            <span className='icon-[mdi--close-circle-outline] h-8 w-8' />
            Hide Introduction
          </BaseButton>
        ) : (
          <BaseButton
            className='w-full px-20 py-4 text-lg font-semibold sm:w-auto'
            onClick={togglePlayVideo}
            styleType='primary'
          >
            <span className='icon-[mdi--youtube] h-8 w-8' />
            Introduction
          </BaseButton>
        )}
        <DemoButton />
      </div>

      <div className='flex flex-col items-center justify-center'>
        <iframe
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
          className={clsx(
            'aspect-video max-w-full rounded border-0 bg-black shadow-xl shadow-zinc-500',
            isPlayingVideo ? 'my-6 aspect-video w-[840px]' : 'h-0',
          )}
          src={videoSrc}
          title='YouTube video player'
          width='840'
        />
      </div>

      <BaseCallout>
        <div className='flex items-center justify-center gap-2 text-xs leading-relaxed'>
          <span className='icon-[mdi--lightbulb-on-outline] h-4 w-4 shrink-0' />
          <div className='flex flex-col'>
            <div className='align-middle'>
              It&lsquo;s highly recommended to use a
              <span className='icon-[mdi--controller] mx-1 h-4 w-4 shrink-0 align-middle' />
              <span className='font-bold'>game controller</span> to experience Retro Assembly, though
              <span className='icon-[mdi--mouse] mx-1 h-4 w-4 shrink-0 align-middle' />
              mouses and
              <span className='icon-[mdi--keyboard] mx-1 h-4 w-4 shrink-0 align-middle' />
              keyboards are supported.
            </div>
            <div className='flex items-center'>
              You can
              <BaseDialogTrigger content={<ConfigGamepadDialogContent />}>
                <button className='rounded border-2 border-transparent bg-rose-200 px-2 focus:border-rose-700'>
                  <div className='flex items-center'>
                    configure your
                    <span className='icon-[mdi--controller] mx-1 h-4 w-4' />
                    controllers
                  </div>
                </button>
              </BaseDialogTrigger>
              <div className='mx-1'> or </div>
              <BaseDialogTrigger content={<ConfigKeyboardDialogContent />}>
                <button className='rounded border-2 border-transparent bg-rose-200 px-2 focus:border-rose-700'>
                  <div className='flex items-center'>
                    configure your
                    <span className='icon-[mdi--keyboard] mx-1 h-4 w-4' />
                    keyboard
                  </div>
                </button>
              </BaseDialogTrigger>
              .
            </div>
          </div>
        </div>
      </BaseCallout>

      <div className='get-started-content mt-4 w-full rounded-xl border-2 border-rose-700 px-10 py-6'>
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
