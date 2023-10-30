import { GetStarted } from './get-started'
import { Header } from './header'

const backgroundImage =
  'repeating-linear-gradient(45deg, #fafafa 25%, transparent 25%, transparent 75%, #fafafa 75%, #fafafa), repeating-linear-gradient(45deg, #fafafa 25%, white 25%, white 75%, #fafafa 75%, #fafafa)'
export default function SetupWizard() {
  return (
    <div className='min-h-screen bg-white  bg-[length:30px_30px] bg-[0_0,15px_15px]' style={{ backgroundImage }}>
      <div className='hero relative h-[600px] max-h-[50vh] min-h-[450px]'>
        <div className='absolute right-5 top-5 z-[2] flex items-center gap-4 text-sm text-white'>
          <a
            className='flex items-center justify-center gap-1'
            href='https://github.com/arianrhodsandlot/retro-assembly'
            rel='noreferrer'
            target='_blank'
          >
            <span className='icon-[simple-icons--github] mr-1 h-5 w-5' />
            GitHub
          </a>
          <a
            className='hidden items-center justify-center gap-1'
            href='https://discord.gg/RVVAMcCH'
            rel='noreferrer'
            target='_blank'
          >
            <span className='icon-[simple-icons--discord] mr-1 h-5 w-5' />
            Discord
          </a>
        </div>

        <div className='relative z-[1] flex h-full flex-col'>
          <div className='flex-1' />
          <Header />
        </div>
      </div>

      <GetStarted />

      <div className='mt-10 py-4 text-center text-xs text-rose-700'>
        <div className='flex items-center justify-center gap-2'>
          <div>
            <span>Version</span>
            <a
              className='ml-1 underline decoration-dotted underline-offset-4'
              href={`https://github.com/arianrhodsandlot/retro-assembly/tree/${GIT_VERSION}`}
              rel='noreferrer'
              target='_blank'
            >
              {GIT_VERSION}
            </a>
          </div>
          ·
          <div>
            <span>Last Updated</span>
            <span className='ml-1'>{BUILD_TIME}</span>
          </div>
        </div>
        <div className='mt-1 flex items-center justify-center gap-2'>
          <div>
            <span>©</span>
            <a
              className='mx-1 underline decoration-dotted underline-offset-4'
              href='https://github.com/arianrhodsandlot/'
              rel='noreferrer'
              target='_blank'
            >
              arianrhodsandlot
            </a>
            <span>2023</span>
          </div>
          ·
          <div>
            <a className='underline decoration-dotted underline-offset-4' href='/privacy-policy.html' target='_blank'>
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
