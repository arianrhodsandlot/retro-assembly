import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { type Rom, getCover } from '../../core'
import GameEntryImage from './game-entry-image'

export default function GameEntry({ rom, onClick }: { rom: Rom; onClick: React.MouseEventHandler<HTMLButtonElement> }) {
  const [gameImageStatus, setGameImageStatus] = useState({ valid: true, loading: true })

  const gameImageSrc = rom.gameInfo ? getCover({ system: rom.system, name: rom.gameInfo.name }) : ''

  function onImgError() {
    setGameImageStatus({ valid: false, loading: false })
  }

  function onImageLoad() {
    setGameImageStatus({ valid: true, loading: false })
  }

  useEffect(() => {
    ;(async () => {
      let valid = true
      let loading = true
      try {
        await rom.ready()
        valid = Boolean(getCover({ system: rom.system, name: rom.gameInfo?.name }))
      } catch (error) {
        valid = false
        console.warn(error)
      }
      loading = valid
      setGameImageStatus({ valid, loading })
    })()
  }, [rom])

  const gameEntryImageWithLoader = (
    <>
      {gameImageStatus.loading && <div className='h-full w-full bg-slate-400' />}
      <GameEntryImage
        status={gameImageStatus}
        src={gameImageSrc}
        alt={rom.goodCode.rom}
        onLoad={onImageLoad}
        onError={onImgError}
      />
    </>
  )

  const gameEntryText = (
    <div className='flex h-full w-full items-center justify-center bg-gray-400 font-bold'>{rom.goodCode.rom}</div>
  )

  return (
    <button
      onClick={onClick}
      className={classNames(
        'relative aspect-square w-[12.5%] transform-gpu overflow-hidden border-white text-left transition-transform',
        gameImageStatus.loading
          ? 'scale-[98%]'
          : 'hover:z-10 hover:scale-110 hover:rounded-sm hover:border-4 hover:shadow-md'
      )}
    >
      {gameImageStatus.valid ? gameEntryImageWithLoader : gameEntryText}
    </button>
  )
}
