import HomeScreen from './home-screen'
import '../styles/index.sass'

export default function App() {
  return (
    <div className='min-h-screen'>
      <div className='bg-[#fe0000] text-white w-[200px] flex flex-col absolute h-screen'>
        <div className='text-center text-xl pt-10'>Retro Assembly</div>
        <div className='flex-1'></div>
        <button className='mb-10'>Settings</button>
      </div>
      <div className='ml-[200px] h-screen overflow-x-hidden'>
        <HomeScreen />
      </div>
    </div>
  )
}
