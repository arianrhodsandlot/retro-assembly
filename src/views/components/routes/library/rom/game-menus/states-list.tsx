import { clsx } from 'clsx'
import { useAtom } from 'jotai'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAsync } from 'react-use'
import { getStates } from '../../../../../../core'
import { shouldFocusStatesListAtom } from './atoms'
import { StateItem } from './state-item'

export function StatesList({ onSelect }: { onSelect: (stateId: string) => void }) {
  const { t } = useTranslation()
  const [shouldFocusStatesList, setShouldFocusStatesList] = useAtom(shouldFocusStatesListAtom)
  const firstStateRef = useRef<HTMLButtonElement>(null)
  const state = useAsync(getStates)

  const hasStates = state?.value?.length && state?.value?.length > 0

  useEffect(() => {
    if (shouldFocusStatesList) {
      if (hasStates) {
        firstStateRef.current?.focus()
      } else {
        setShouldFocusStatesList(false)
      }
    }
  }, [shouldFocusStatesList, hasStates, setShouldFocusStatesList])

  return (
    <div className={clsx('relative h-full py-20')}>
      {state.loading ? (
        <div className='flex h-full max-w-2xl items-center justify-center overflow-auto px-20'>
          <span className='icon-[line-md--loading-loop] size-12 text-white' />
        </div>
      ) : state.error ? (
        <div className='flex h-full max-w-2xl items-center justify-center overflow-auto px-20'>
          <span className='icon-[mdi--alert-circle-outline] mr-2 size-6' />
          {t('Failed to load state list')}
        </div>
      ) : state?.value?.length ? (
        <div className='flex max-h-full flex-col overflow-auto px-20'>
          {state?.value?.map((s, index) => (
            <StateItem key={s.id} onSelect={onSelect} ref={index === 0 ? firstStateRef : undefined} state={s} />
          ))}
        </div>
      ) : (
        <div className='flex h-full items-center pl-20 opacity-60'>
          <div className='flex items-center text-xl'>
            <span className='icon-[mdi--file-hidden] mr-2 size-6' />
            {t('There are no saved states for current game.')}
          </div>
        </div>
      )}
    </div>
  )
}
