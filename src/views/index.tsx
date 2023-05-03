import './styles/index.sass'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { OneDriveProvider } from '../core'
import App from './components/app'

window.O = OneDriveProvider
window.o = OneDriveProvider.get()
window.c = o.client

const rootElement = document.querySelector<HTMLDivElement>('#root')
if (rootElement) {
  createRoot(rootElement).render(
    <>
      <App />
    </>
  )
}
