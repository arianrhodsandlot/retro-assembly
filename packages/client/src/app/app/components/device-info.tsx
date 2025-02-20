export function DeviceInfo({ platform }: { platform: string }) {
  return (
    <div className='flex'>
      <div className='flex flex-col gap-8 px-4'>
        <h1 className='px-8 pt-4 text-5xl font-bold'>Nintendo Entertainment System</h1>
        <div className='rounded bg-zinc-200 px-8 py-4'>
          <div className='flex gap-8 *:min-w-36'>
            <div>
              <div className='flex items-center gap-2 font-semibold'>
                <span className='icon-[mdi--calendar]' />
                Released
              </div>
              <div className='pl-6'>1983-07-15</div>
            </div>

            <div>
              <div className='flex items-center gap-2 font-semibold'>
                <span className='icon-[mdi--chip]' />
                Developer
              </div>
              <div className='pl-6'>Nintendo R&D2</div>
            </div>

            <div>
              <div className='flex items-center gap-2 font-semibold'>
                <span className='icon-[mdi--factory]' />
                Manufacturer
              </div>
              <div className='pl-6'>Nintendo Co., Ltd.</div>
            </div>
          </div>
        </div>
        <div className='prose-neutral prose max-w-none whitespace-pre-line px-8 text-justify font-[Roboto_Slab_Variable]'>
          The Nintendo Entertainment System is an 8-bit video game console that was released by Nintendo in North
          America during 1985, in Europe during 1986 and Australia in 1987. In most of Asia, including Japan (where it
          was first launched in 1983), China, Vietnam, Singapore, the Middle East and Hong Kong, it was released as the
          Family Computer, commonly shortened as either the romanized contraction Famicom, or abbreviated to FC. In
          South Korea, it was known as the Hyundai Comboy, and was distributed by Hynix which then was known as Hyundai
          Electronics.
        </div>
      </div>
      <div className='w-lg shrink-0'>
        <img
          alt='xxx'
          className='h-auto w-full'
          src='https://raw.githubusercontent.com/Mattersons/es-theme-neutral/refs/heads/master/systems/device/nes.png'
        />
      </div>
    </div>
  )
}
