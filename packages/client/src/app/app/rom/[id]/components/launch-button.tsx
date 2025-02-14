import { Suspense } from 'react'
import { LaunchButtonInner } from './launch-button-inner'

export function LaunchButton({ rom }) {
  return (
    <Suspense fallback={'loading...'}>
      <LaunchButtonInner rom={rom} />
    </Suspense>
  )
}
