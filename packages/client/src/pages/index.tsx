'use client'
import { useEffect } from 'react'
import { Link } from 'waku'
import { Counter } from '@/components/counter'
import { api } from '@/utils/api'

export default function HomePage() {
  useEffect(() => {
    ;(async () => {
      try {
        const p = await api.getPlatforms()
        console.info(p)
      } catch (error) {
        console.error(error)
      }
    })()
  })
  const data = { body: 'a', headline: 'xx', title: 'x' }

  return (
    <div>
      <title>{data.title}</title>
      <h1 className='text-2xl font-bold tracking-tight'>{data.headline}</h1>
      <p>{data.body}</p>
      <Counter />
      <Link className='mt-12 inline-block underline' to='/about'>
        About page
      </Link>
    </div>
  )
}
