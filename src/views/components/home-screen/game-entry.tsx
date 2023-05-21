import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import classNames from 'classnames'
import { AnimatePresence, type Target, motion } from 'framer-motion'
import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
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
  // const gameEntryRef = useRef<HTMLButtonElement>(null)
  const [maskPosition, setMaskPosition] = useState<Target>()
  const gameImageSrc = rom.gameInfo ? getCover({ system: rom.system, name: rom.gameInfo.name }) : ''
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const { ref, focused } = useFocusable({ onFocus })

  const maskInitialStyle = { ...maskPosition, filter: 'brightness(1)' }
  const maskExpandedStyle = {
    ...maskPosition,
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    filter: 'brightness(.1)',
  }

  function onFocus() {
    const element: HTMLButtonElement = ref.current
    if (element) {
      element.scrollIntoView({ block: 'nearest', inline: 'end' })
    }
  }

  function onGameEntryClick() {
    if (!ref.current) {
      return
    }
    const boundingClientRect = ref.current.getBoundingClientRect()
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
    <div style={style} className='relative bg-[#d8d8d8]'>
      <button
        ref={ref}
        className={classNames(
          { focused },
          'opacity-1 h-full w-full bg-[#d8d8d8] text-left transition-[transform,box-shadow]',
          'after:absolute after:-inset-0 after:border after:border-black',
          gameImageStatus.loading
            ? 'scale-100'
            : [
                {
                  'relative z-10 scale-110 shadow-2xl shadow-black': focused,
                },
                focused
                  ? {
                      'after:-inset-[4px] after:border-[4px] after:border-white': true,

                      'origin-top-left translate-x-[4px] translate-y-[4px]': isFirstRow && isFirstColumn,
                      'origin-top translate-y-[4px]': isFirstRow && !isFirstColumn && !isLastColumn,
                      'origin-top-right -translate-x-[4px] translate-y-[4px]': isFirstRow && isLastColumn,

                      'origin-left translate-x-[4px]': !isFirstRow && isFirstColumn && !isLastRow,
                      'origin-center': !isFirstRow && !isLastRow && !isFirstColumn && !isLastColumn,
                      'origin-right -translate-x-[4px]': !isFirstRow && isLastColumn,

                      'origin-bottom-left -translate-y-[4px] translate-x-[4px]': isLastRow && isFirstColumn,
                      'origin-bottom -translate-y-[4px]': isLastRow && !isFirstColumn && !isLastColumn,
                      'origin-bottom-right -translate-x-[4px] -translate-y-[4px]': isLastRow && isLastColumn,
                    }
                  : {},
              ]
        )}
        onClick={onGameEntryClick}
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
