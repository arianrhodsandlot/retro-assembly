import HomeScreen from './home-screen'
import '../styles/index.sass'

export default function App() {
  return (
    <div className='min-h-screen'>
      <div className='absolute flex h-screen w-[200px] flex-col bg-[#fe0000] text-white'>
        <div className='pt-10 text-center text-xl'>Retro Assembly</div>
        <div className='flex-1'></div>
        <button className='mb-10'>Settings</button>
      </div>
      <div className='h-screen w-full overflow-x-hidden pl-[200px]'>
        <HomeScreen />
      </div>
    </div>
  )
}
