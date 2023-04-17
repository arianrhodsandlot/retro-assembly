import { type FileWithDirectoryAndFileHandle } from 'browser-fs-access'
import { useEffect, useState } from 'react'
import { getGameSystem, guessGameInfo } from './lib/utils'

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
