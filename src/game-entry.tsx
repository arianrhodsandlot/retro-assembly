import { type FileWithDirectoryAndFileHandle } from 'browser-fs-access'
import { parse } from 'goodcodes-parser'
import { camelCase, isEqual, pick } from 'lodash-es'
import { useEffect, useState } from 'react'

window.parse = parse

function getGameSystem(file: FileWithDirectoryAndFileHandle) {
  if (file.webkitRelativePath.includes('nes')) {
    return 'nes'
  }
  if (file.webkitRelativePath.includes('n64')) {
    return 'n64'
  }
  if (file.webkitRelativePath.includes('gba')) {
    return 'gba'
  }
  if (file.webkitRelativePath.includes('gbc')) {
    return 'gbc'
  }
  if (file.webkitRelativePath.includes('gb')) {
    return 'gb'
  }
  if (file.webkitRelativePath.includes('megadrive')) {
    return 'megadrive'
  }
}

function isSimilarEntry(entry1, entry2) {
  const comparePropNames = ['contries', 'languages', 'revision', 'versions']
  const entry1Props = pick(entry1.codes, comparePropNames)
  const entry2Props = pick(entry2.codes, comparePropNames)
  return isEqual(entry1Props, entry2Props)
}

async function guessGameInfo(rom) {
  const { default: rdb } = await import(
    './generated/retroarch-databases/Nintendo - Nintendo Entertainment System.rdb.json'
  )

  const parsedRomName = parse(`0 - ${rom.name}`)
  const candidates: any[] = []
  for (const entry of rdb) {
    if (entry.name) {
      // workaround for https://github.com/jbdemonte/goodcodes-parser/issues/13
      const fileRomName = parsedRomName.rom
      const entryName = parse(`0 - ${entry.name}`).rom
      const normalizedFileRomName = camelCase(fileRomName).toLowerCase()
      const normalizedEntryName = camelCase(entryName).toLowerCase()
      if (normalizedFileRomName === normalizedEntryName) {
        candidates.push(entry)
      }
    }
  }

  if (candidates.length > 1) {
    for (const entry of candidates) {
      const parsedEntryName = parse(`0 - ${entry.name}`)
      if (isSimilarEntry(parsedRomName, parsedEntryName)) {
        return { goodcodes: parsedRomName, detail: entry }
      }
    }
  }

  return { goodcodes: parsedRomName, detail: candidates[0] }
}

export default function GameEntry({
  file,
  onClick,
}: {
  file: FileWithDirectoryAndFileHandle
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
  const [gameInfo, setGameInfo] = useState<Awaited<ReturnType<typeof guessGameInfo>>>()
  useEffect(() => {
    ;(async () => {
      const newGameInfo = await guessGameInfo(file)
      setGameInfo(newGameInfo)
    })()
  }, [file])
  return (
    <button onClick={onClick} className='flex flex-col bg-red overflow-hidden text-left'>
      {gameInfo && (
        <>
          <div>
            {gameInfo.detail ? (
              <img
                className='w-60 h-60 bg-black'
                style={{ imageRendering: 'pixelated' }}
                src={`https://thumbnails.libretro.com/Nintendo%20-%20Nintendo%20Entertainment%20System/Named_Titles/${encodeURIComponent(
                  gameInfo.detail.name
                )}.png`}
                alt=''
              />
            ) : (
              <div className='w-60 h-60 bg-black' />
            )}
          </div>
          <div className='w-60 truncate'>{gameInfo.goodcodes.rom}</div>
          <div>{getGameSystem(file)}</div>
        </>
      )}
    </button>
  )
}
