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
export function GameEntry({
  rom,
  index,
  columnIndex,
  rowIndex,
  rowCount,
  columnCount,
  style,
  onFocus,
}: {
  rom: Rom
  index: number
  columnIndex: number
  rowIndex: number
  rowCount: number
  columnCount: number
  style: React.CSSProperties
  onFocus: React.FocusEventHandler<HTMLButtonElement>
}) {
  const setCurrentRom = useSetAtom(currentRomAtom)
  const [gameImageStatus, setGameImageStatus] = useState({ valid: true, loading: false })
  const ref = useRef<HTMLButtonElement>(null)
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

  function onClick() {
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
        ref.current?.focus()

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
    <button style={style} className='group relative bg-[#d8d8d8]' ref={ref} onFocus={onFocus} onClick={onClick}>
      <span
        className={classNames(
          'opacity-1 block h-full w-full bg-[#d8d8d8] text-left transition-[transform] group-focus:transform-gpu',
          'after:absolute after:-inset-0 after:border after:border-black',
          gameImageStatus.loading
            ? 'scale-100'
            : [
                'group-focus:relative group-focus:z-10 group-focus:scale-110 group-focus:shadow-2xl group-focus:shadow-black',
                'group-focus:after:-inset-[4px] group-focus:after:animate-pulse group-focus:after:border-[4px] group-focus:after:border-white',
                {
                  'group-focus:origin-top-left group-focus:translate-x-[4px] group-focus:translate-y-[4px]':
                    isFirstRow && isFirstColumn,
                  'group-focus:origin-top group-focus:translate-y-[4px]': isFirstRow && !isFirstColumn && !isLastColumn,
                  'group-focus:origin-top-right group-focus:-translate-x-[4px] group-focus:translate-y-[4px]':
                    isFirstRow && isLastColumn,

                  'group-focus:origin-left group-focus:translate-x-[4px]': !isFirstRow && isFirstColumn && !isLastRow,
                  'group-focus:origin-center': !isFirstRow && !isLastRow && !isFirstColumn && !isLastColumn,
                  'group-focus:origin-right group-focus:-translate-x-[4px]': !isFirstRow && isLastColumn,

                  'group-focus:origin-bottom-left group-focus:-translate-y-[4px] group-focus:translate-x-[4px]':
                    isLastRow && isFirstColumn,
                  'group-focus:origin-bottom group-focus:-translate-y-[4px]':
                    isLastRow && !isFirstColumn && !isLastColumn,
                  'group-focus:origin-bottom-right group-focus:-translate-x-[4px] group-focus:-translate-y-[4px]':
                    isLastRow && isLastColumn,
                },
              ]
        )}
      >
        {gameImageStatus.valid ? gameEntryImageWithLoader : gameEntryText}
      </span>

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
    </button>
  )
}
