import { type Target } from 'framer-motion'
import $ from 'jquery'
import { uniq } from 'lodash-es'
import { memo, useState } from 'react'
import { type Rom, launchGame } from '../../../../core'
import { emitter } from '../../../lib/emitter'
import { DistrictIcon } from './district-icon'
import { GameEntryButton } from './game-entry-button'
import { GameEntryContent } from './game-entry-content'
import { GameEntryPortals } from './game-entry-portals'

function onFocus(e: React.FocusEvent<HTMLButtonElement, Element>) {
  const $focusedElement = $(e.currentTarget)
  const $outer = $focusedElement.offsetParent()
  const outerScrollTop = $outer.scrollTop()
  const outerHeight = $outer.height()
  const focusedElementHeight = $focusedElement.height()
  if (outerScrollTop && outerHeight && focusedElementHeight) {
    const offsetTop = $focusedElement.position().top + outerScrollTop
    const scrollTop = offsetTop - outerHeight / 2 + focusedElementHeight / 2
    $outer.stop().animate({ scrollTop }, 100)
  }
}

function GameEntry({
  rom,
  columnIndex,
  rowIndex,
  rowCount,
  columnCount,
  style,
}: {
  rom: Rom
  columnIndex: number
  rowIndex: number
  rowCount: number
  columnCount: number
  style: React.CSSProperties
}) {
  const [maskPosition, setMaskPosition] = useState<Target>()

  function onExit() {
    setMaskPosition(undefined)
    emitter.off('exit', onExit)
  }

  function onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const boundingClientRect = event.currentTarget.getBoundingClientRect()
    setMaskPosition({
      top: boundingClientRect.y,
      left: boundingClientRect.x,
      width: boundingClientRect.width,
      height: boundingClientRect.height,
    })

    emitter.on('exit', onExit)
  }

  const isFirstRow = rowIndex === 0
  const isFirstColumn = columnIndex === 0
  const isLastRow = !isFirstRow && rowIndex === rowCount - 1
  const isLastColumn = !isFirstColumn && columnIndex === columnCount - 1

  const gameEntryContent = <GameEntryContent rom={rom} />

  const { goodCode } = rom
  const { codes } = goodCode
  const { revision, countries } = codes
  const districts = uniq(countries?.map(({ code }) => code))

  return (
    <>
      <GameEntryButton
        isFirstColumn={isFirstColumn}
        isFirstRow={isFirstRow}
        isLastColumn={isLastColumn}
        isLastRow={isLastRow}
        onClick={onClick}
        onFocus={onFocus}
        style={style}
      >
        {gameEntryContent}
        <div
          className='absolute bottom-0 w-full overflow-hidden bg-[#ffffffee] px-1 py-1 text-center text-xs text-slate-400'
          title={rom.name}
        >
          {districts?.map((district) => (
            <DistrictIcon district={district} key={district} />
          ))}

          <span className='align-middle'>{goodCode.rom}</span>

          {revision !== undefined && (
            <span className='ml-2 inline-block rounded bg-gray-200 px-1'>
              <span className='icon-[octicon--versions-16] h-4 w-4 align-middle' />
              {revision > 1 && <span className='ml-2 h-4 align-middle font-mono'>{revision}</span>}
            </span>
          )}
        </div>
      </GameEntryButton>

      <GameEntryPortals maskContent={gameEntryContent} maskPosition={maskPosition} onMaskShow={() => launchGame(rom)} />
    </>
  )
}

function arePropsEqual(oldProps, newProps) {
  if (oldProps === newProps) {
    return true
  }

  if (oldProps.rom.id !== newProps.rom.id) {
    return false
  }

  for (const key of ['columnCount', 'columnIndex', 'rowCount', 'rowIndex']) {
    if (oldProps[key] !== newProps[key]) {
      return false
    }
  }

  return true
}

const MemoedGameEntry = memo(GameEntry, arePropsEqual)

export { MemoedGameEntry as GameEntry }
