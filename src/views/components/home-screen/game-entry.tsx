import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { type Rom, getCover } from '../../../core'
import GameEntryImage from './game-entry-image'

export default function GameEntry({ rom, onClick }: { rom: Rom; onClick: React.MouseEventHandler<HTMLButtonElement> }) {
  const [gameImageStatus, setGameImageStatus] = useState({ valid: true, loading: false })

  const gameImageSrc = rom.gameInfo ? getCover({ system: rom.system, name: rom.gameInfo.name }) : ''

  useEffect(() => {
    ;(async () => {
      let valid = true
      let loading = true
      try {
        await rom.ready()
      } catch (error) {
        valid = false
        console.warn(error)
      }
      loading = valid
      setGameImageStatus({ valid, loading })
    })()
  }, [rom])

  useEffect(() => {
    if (!gameImageSrc) {
      if (gameImageStatus.loading) {
        setGameImageStatus({ valid: false, loading: false })
      }
      return
    }
    const img = new Image()
    img.src = gameImageSrc
    img.addEventListener('load', () => {
      setGameImageStatus({ valid: true, loading: false })
    })
    img.addEventListener('error', (error) => {
      console.log(error)
      setGameImageStatus({ valid: false, loading: false })
    })
  }, [gameImageStatus.loading, gameImageSrc])

  const gameEntryImageWithLoader = (
    <>
      {gameImageStatus.loading && <div className='h-full w-full bg-slate-400' />}
      {gameImageSrc && <GameEntryImage src={gameImageSrc} alt={rom.goodCode.rom} />}
    </>
  )

  const gameEntryText = (
    <div className='flex h-full w-full items-center justify-center bg-gray-400 font-bold'>{rom.goodCode.rom}</div>
  )

  return (
    <button
      onClick={onClick}
      className={classNames(
        'absolute -inset-[3px] overflow-hidden border-4 border-transparent text-left transition-transform',
        gameImageStatus.loading
          ? 'scale-[99%]'
          : 'hover:z-10 hover:scale-110 hover:rounded hover:border-white hover:shadow-2xl hover:shadow-black'
      )}
    >
      {gameImageStatus.valid ? gameEntryImageWithLoader : gameEntryText}
    </button>
  )
}
