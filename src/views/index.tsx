import './styles/index.sass'
import { createRoot } from 'react-dom/client'
import App from './components/app'
import './lib/spatial-navigation'
import path from 'path-browserify'

window.path = path
const rootElement = document.querySelector<HTMLDivElement>('#root')
if (rootElement) {
  createRoot(rootElement).render(<App />)
}

