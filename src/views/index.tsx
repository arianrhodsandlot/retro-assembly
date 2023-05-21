import './styles/index.sass'
import { init } from '@noriginmedia/norigin-spatial-navigation'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/app'

const rootElement = document.querySelector<HTMLDivElement>('#root')
if (rootElement) {
  init({
    // debug: true,
    // visualDebug: true,
    useGetBoundingClientRect: false,
  })

  createRoot(rootElement).render(
    <>
      <App />
    </>
  )
}
