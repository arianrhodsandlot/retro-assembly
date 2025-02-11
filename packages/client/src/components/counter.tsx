'use client'

import { useState } from 'react'

export const Counter = () => {
  const [count, setCount] = useState(0)

  const handleIncrement = () => setCount((c) => c + 1)

  return (
    <section className='-mx-4 mt-4 rounded-sm border border-dashed border-blue-400 p-4'>
      <div>Count: {count}</div>
      <button className='rounded-xs bg-black px-2 py-0.5 text-sm text-white' onClick={handleIncrement}>
        Increment
      </button>
    </section>
  )
}
