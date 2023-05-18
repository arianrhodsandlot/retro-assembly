import classNames from 'classnames'
import delay from 'delay'
import { type Target, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { type Rom, getCover } from '../../../core'
import GameEntryImage from './game-entry-image'

export default function GameEntry({
  rom,
  index,
  columnIndex,
  rowIndex,
  rowCount,
  columnCount,
  style,
  onClick,
}: {
  rom: Rom
  index: number
  columnIndex: number
  rowIndex: number
  rowCount: number
  columnCount: number
  style: React.CSSProperties
  onClick: () => void
}) {
  const [gameImageStatus, setGameImageStatus] = useState({ valid: true, loading: false })
  const gameEntryRef = useRef<HTMLButtonElement>(null)
  const [maskPosition, setMaskPosition] = useState<Target>()
  const gameImageSrc = rom.gameInfo ? getCover({ system: rom.system, name: rom.gameInfo.name }) : ''

  function onGameEntryClick() {
    if (!gameEntryRef.current) {
      return
    }
    const boundingClientRect = gameEntryRef.current.getBoundingClientRect()
    setMaskPosition({
      top: boundingClientRect.y,
      left: boundingClientRect.x,
      width: boundingClientRect.width,
      height: boundingClientRect.height,
    })
  }

  function onAnimationComplete() {
    onClick()
    setMaskPosition(undefined)
  }

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

  const isFirstRow = rowIndex === 0
  const isFirstColumn = columnIndex === 0
  const isLastRow = !isFirstRow && rowIndex === rowCount - 1
  const isLastColumn = !isFirstColumn && columnIndex === columnCount - 1

  return (
    <>
      <button
        className={classNames(
          'overflow-hidden bg-white text-left transition-transform',
          gameImageStatus.loading
            ? 'scale-[99%]'
            : [
                'hover:z-10 hover:scale-110 hover:rounded hover:border-4 hover:border-white hover:shadow-2xl hover:shadow-black',
                {
                  'origin-top-left': isFirstRow && isFirstColumn,
                  'origin-top': isFirstRow && !isFirstColumn && !isLastColumn,
                  'origin-top-right': isFirstRow && isLastColumn,
                  'origin-left': !isFirstRow && isFirstColumn,
                  'origin-right': !isFirstRow && isLastColumn,
                  'origin-bottom-left': isLastRow && isFirstColumn,
                  'origin-bottom': isLastRow && !isFirstColumn && !isLastColumn,
                  'origin-bottom-right': isLastRow && isLastColumn,
                },
              ]
        )}
        style={style}
        onClick={onGameEntryClick}
        ref={gameEntryRef}
      >
        {gameImageStatus.valid ? gameEntryImageWithLoader : gameEntryText}
      </button>

      {maskPosition &&
        createPortal(
          <motion.div
            className='fixed z-10 overflow-hidden'
            initial={maskPosition}
            animate={{ top: 0, left: 0, width: '100%', height: '100%', filter: 'brightness(0)' }}
            onAnimationComplete={onAnimationComplete}
          >
            {gameImageStatus.valid ? gameEntryImageWithLoader : gameEntryText}
          </motion.div>,
          document.body
        )}
    </>
  )
}
