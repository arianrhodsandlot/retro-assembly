import { useAsync } from '@react-hookz/web'
import { useEffect } from 'react'

// eslint-disable-next-line func-style
export const useAsyncExecute: typeof useAsync = function useAsyncExecute(
  asyncFn: (...params: unknown[]) => Promise<unknown>,
  initialValue?: unknown,
) {
  const hooks = useAsync(asyncFn, initialValue)

  const [, { execute }] = hooks
  useEffect(() => {
    execute()
  }, [execute])
  return hooks
}
