'use client'
import { fileOpen } from 'browser-fs-access'
import ky from 'ky'
import { Link } from 'waku'

export default function HomePage() {
  async function handleClick() {
    const fileHandle = await fileOpen()

    const formData = new FormData()
    formData.append('file', fileHandle)

    await ky.post('/api/v1/rom/add', {
      body: formData,
    })
  }

  return (
    <div>
      <div className='text-center'>
        <div className='p-40 text-4xl'>-</div>
        <div className='flex items-center justify-center'>
          <Link className='rounded bg-neutral-100 px-8 py-4 text-xl' to='/app'>
            Press any key to start
          </Link>
          <button onClick={handleClick} type='button'>
            upload
          </button>
        </div>
      </div>
    </div>
  )
}
