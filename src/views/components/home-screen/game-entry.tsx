import classNames from 'classnames'
import { AnimatePresence, type Target, motion } from 'framer-motion'
import { useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useWindowSize } from 'react-use'
import { type Rom, getCover } from '../../../core'
import { currentRomAtom } from '../../lib/atoms'
import { emitter } from '../../lib/emitter'
import GameEntryImage from './game-entry-image'

// eslint-disable-next-line complexity
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

  const maskInitialStyle = { ...maskPosition, filter: 'brightness(1)' }
  const maskExpandedStyle = {
    ...maskPosition,
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    filter: 'brightness(.1)',
  }

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

  function onAnimationComplete(definition) {
    if (definition === maskExpandedStyle) {
      setCurrentRom(rom)

      emitter.on('exit', () => {
        setMaskPosition(undefined)

        emitter.off('exit')
      })
    }

    if (definition === maskInitialStyle) {
      setCurrentRom(undefined)
    }
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
      {gameImageStatus.loading && <div className='h-full w-full' />}
      {gameImageSrc && <GameEntryImage src={gameImageSrc} alt={rom.goodCode.rom} />}
    </>
  )

  const gameEntryText = (
    <div className='m-auto flex h-full items-center justify-center bg-[#d8d8d8] text-center font-bold'>
      <div className='w-3/4'>{rom.goodCode.rom}</div>
    </div>
  )

  const isFirstRow = rowIndex === 0
  const isFirstColumn = columnIndex === 0
  const isLastRow = !isFirstRow && rowIndex === rowCount - 1
  const isLastColumn = !isFirstColumn && columnIndex === columnCount - 1

  return (
    <div style={style} className='border border-black bg-[#d8d8d8]'>
      <button
        className={classNames(
          'h-full w-full overflow-hidden bg-[#d8d8d8] text-left transition-[transform] hover:relative',
          gameImageStatus.loading
            ? 'scale-[100%]'
            : [
                'hover:z-10 hover:box-content hover:scale-110 hover:border-[4px] hover:border-white hover:shadow-2xl hover:shadow-black',
                {
                  'origin-top-left': isFirstRow && isFirstColumn,
                  'right-[4px] origin-top': isFirstRow && !isFirstColumn && !isLastColumn,
                  'right-[4px] origin-top-right': isFirstRow && isLastColumn,
                  'bottom-[4px] origin-left': !isFirstRow && isFirstColumn && !isLastRow,
                  'bottom-[4px] right-[4px] origin-center':
                    !isFirstRow && !isLastRow && !isFirstColumn && !isLastColumn,
                  'bottom-[4px] right-[4px] origin-right': !isFirstRow && isLastColumn,
                  'bottom-[8px] origin-bottom-left': isLastRow && isFirstColumn,
                  'bottom-[8px] origin-bottom': isLastRow && !isFirstColumn && !isLastColumn,
                  'bottom-[8px] right-[4px] origin-bottom-right': isLastRow && isLastColumn,
                },
              ]
        )}
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
              animate={maskExpandedStyle}
              exit={maskInitialStyle}
              transition={{ duration: 0.2 }}
              onAnimationComplete={onAnimationComplete}
            >
              {gameImageStatus.valid ? gameEntryImageWithLoader : gameEntryText}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
