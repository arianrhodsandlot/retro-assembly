import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { useAsync } from 'react-use'

interface StateItemProps {
  onSelect: (stateId: string) => void
  state: any
}

export function StateItem({
  onSelect,
  ref,
  state,
}: { ref?: React.RefObject<HTMLButtonElement | null> } & StateItemProps) {
  const { t } = useTranslation()
  const thumbnailUrlState = useAsync(async () => await state.thumbnail?.getUrl())

  return (
    <button
      className={clsx(
        'group mt-10 flex max-w-2xl shrink-0 items-center overflow-hidden rounded border-4 border-white bg-black/90 first:mt-0',
        'focus:animate-[pulse-white-border_1.5s_ease-in-out_infinite] focus:text-rose-700',
      )}
      data-testid='state-item'
      onClick={() => onSelect(state.id)}
      ref={ref}
      type='button'
    >
      <div className='size-36 overflow-hidden'>
        {state.thumbnail ? (
          thumbnailUrlState.value ? (
            <img
              alt={`the thumnail of the state saved at ${state.createTime.humanized}`}
              className='block size-36 transform-gpu bg-gray-300 object-cover text-transparent transition-transform'
              src={thumbnailUrlState.value}
            />
          ) : (
            <div className='flex size-36 animate-pulse items-center justify-center bg-gray-300' />
          )
        ) : (
          <div className='flex size-36 items-center justify-center bg-gray-600 '>
            <span className='icon-[mdi--image-broken-variant] size-12 text-white' />
          </div>
        )}
      </div>
      <div className={clsx('flex h-36 flex-1 items-center border-l-4 border-l-white px-6', 'group-focus:bg-white')}>
        {t('Saved at')} {state.createTime.humanized}
      </div>
    </button>
  )
}
