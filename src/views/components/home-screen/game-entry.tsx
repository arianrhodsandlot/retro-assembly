import classNames from 'classnames'
import { AnimatePresence, type Target, motion } from 'framer-motion'
import { useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLockBodyScroll, useToggle, useWindowSize } from 'react-use'
import { type Rom, getCover } from '../../../core'
import { currentRomAtom } from '../../lib/atoms'
import { emitter } from '../../lib/emitter'
import GameEntryImage from './game-entry-image'

export default function GameEntry({
  rom,
  index,
  columnIndex,
  rowIndex,
  rowCount,
  columnCount,
  style,
}: {
  rom: Rom
  index: number
  columnIndex: number
  rowIndex: number
  rowCount: number
  columnCount: number
  style: React.CSSProperties
}) {
  const setCurrentRom = useSetAtom(currentRomAtom)
  const [gameImageStatus, setGameImageStatus] = useState({ valid: true, loading: false })
  const gameEntryRef = useRef<HTMLButtonElement>(null)
  const [maskPosition, setMaskPosition] = useState<Target>()
  const gameImageSrc = rom.gameInfo ? getCover({ system: rom.system, name: rom.gameInfo.name }) : ''
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const [locked, toggleLocked] = useToggle(false)
  useLockBodyScroll(locked)

  function onGameEntryClick() {
    if (!gameEntryRef.current) {
      return
    }
    toggleLocked(true)
    const boundingClientRect = gameEntryRef.current.getBoundingClientRect()
    setMaskPosition({
      top: boundingClientRect.y,
      left: boundingClientRect.x,
      width: boundingClientRect.width,
      height: boundingClientRect.height,
    })
  }

  function onAnimationComplete() {
    toggleLocked(false)
    setCurrentRom(rom)

    emitter.on('exit', () => {
      setMaskPosition(undefined)

      emitter.off('exit')
    })
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

  const maskInitialStyle = { ...maskPosition, filter: 'brightness(1)' }
  const maskInitialAnimateStyle = {
    ...maskPosition,
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    filter: 'brightness(0)',
  }

  return (
    <>
      <button
        className={classNames(
          'overflow-hidden bg-white text-left transition-transform',
          gameImageStatus.loading
            ? 'scale-[100%]'
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

      {createPortal(
        <AnimatePresence>
          {maskPosition && (
            <motion.div
              className='absolute z-10 overflow-hidden'
              initial={maskInitialStyle}
              animate={maskInitialAnimateStyle}
              exit={maskInitialStyle}
              transition={{ duration: 0.3 }}
              onAnimationComplete={onAnimationComplete}
            >
              {gameImageStatus.valid ? gameEntryImageWithLoader : gameEntryText}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}
