'use client'
import { Link } from 'waku'
import { Counter } from '@/components/counter'

export default function HomePage() {
  return (
    <div>
      <Counter />
      <Link className='mt-12 inline-block underline' to='/about'>
        About page
      </Link>
    </div>
  )
}
