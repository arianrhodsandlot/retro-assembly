'use client'
import ky from 'ky'
import useSWRMutation from 'swr/mutation'

export function ScanButton() {
  if (ky) {
    return
  }
  const { isMutating, trigger } = useSWRMutation('/api/v1/library/scan', (url) => ky.post(url))
  const router = useRouter()

  async function handleClick() {
    await trigger()
    router.refresh()
  }

  return (
    <button disabled={isMutating} onClick={handleClick} type='button'>
      {isMutating ? 'scanning...' : 'scan'}
    </button>
  )
}
