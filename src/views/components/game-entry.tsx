import { type FileWithDirectoryAndFileHandle } from 'browser-fs-access'
import { useEffect, useState } from 'react'
import { useAsync } from 'react-use'
import { guessGameDetail, guessSystem } from '../../core/helpers/file'
import { getCover, parseGoodCode } from '../../core/helpers/misc'

export default function GameEntry({
  file,
  onClick,
}: {
  file: FileWithDirectoryAndFileHandle
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) {
  const system = useAsync(() => guessSystem(file), [file])
  const detail = useAsync(() => guessGameDetail(file), [file])
  const [isValidGameImg, setIsValidGameImg] = useState(false)

  const goodcode = parseGoodCode(file.name)
  const cover = getCover({ system: system.value, name: detail.value?.name })

  useEffect(() => {
    setIsValidGameImg(Boolean(cover))
  }, [cover])

  function onImgError() {
    setIsValidGameImg(false)
  }

  return (
    <button onClick={onClick} className='flex flex-col w-60 text-left'>
      <div>
        {isValidGameImg ? (
          <img
            className='w-60 h-60 bg-gray-400'
            style={{ imageRendering: 'pixelated' }}
            src={cover}
            alt={goodcode.rom}
            onError={onImgError}
          />
        ) : (
          <div className='w-60 h-60 bg-gray-400 flex items-center justify-center font-bold'>{goodcode.rom}</div>
        )}
      </div>
    </button>
  )
}
