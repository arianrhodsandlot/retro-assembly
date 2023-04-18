import { type FileWithDirectoryAndFileHandle } from 'browser-fs-access'
import { useEffect, useState } from 'react'
import { guessGameInfo } from './lib/utils'

export default function GameEntry({
  file,
  onClick,
}: {
  file: FileWithDirectoryAndFileHandle
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
  const [gameInfo, setGameInfo] = useState<Awaited<ReturnType<typeof guessGameInfo>>>()
  const [isValidGameImg, setIsValidGameImg] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const newGameInfo = await guessGameInfo(file)
        setGameInfo(newGameInfo)
      } catch (error) {
        console.warn(error)
      }
    })()
  }, [file])

  function onImgError() {
    setIsValidGameImg(false)
  }

  return (
    <button onClick={onClick} className='flex flex-col bg-red overflow-hidden text-left'>
      {gameInfo ? (
        <>
          <div>
            {isValidGameImg ? (
              <img
                className='w-60 h-60 bg-black'
                style={{ imageRendering: 'pixelated' }}
                src={gameInfo.cover}
                alt={gameInfo.goodcodes.rom}
                onError={onImgError}
              />
            ) : (
              <div className='w-60 h-60 bg-black' />
            )}
          </div>
          <div className='w-60 truncate'>{gameInfo.goodcodes.rom}</div>
          <div>{gameInfo.system}</div>
        </>
      ) : (
        <div>{file.name}</div>
      )}
    </button>
  )
}
