'use client'
import { useParams } from 'next/navigation'
import { Nostalgist } from 'nostalgist'
import { use } from 'react'

export function LaunchButtonInner({ rom }) {
  const { id } = useParams()

  const response = use(Promise.resolve(id))

  async function handleClick() {
    alert(response)
    const nostalgist = await Nostalgist.launch({
      core: 'nestopia',
      rom: { fileContent: response, fileName: rom.file_name },
      style: { height: '100px', position: 'static', width: '100px' },
    })

    setTimeout(() => {
      nostalgist.exit()
    }, 3000)
  }

  return (
    <button onClick={handleClick} type='button'>
      Launch
    </button>
  )
}
