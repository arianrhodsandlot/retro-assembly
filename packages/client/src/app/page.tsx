import Link from 'next/link'

export default function Home() {
  return (
    <div className='text-center'>
      <div className='p-40 text-4xl'>Retroassembly</div>
      <div className='flex items-center justify-center'>
        <Link className='rounded bg-neutral-100 text-xl py-4 px-8' href={'/app'}>
          Press any key to start
        </Link>
      </div>
    </div>
  )
}
