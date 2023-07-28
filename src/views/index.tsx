import { createRoot } from 'react-dom/client'
import App from './components/app'
import './lib/global'

const rootElement = document.querySelector<HTMLDivElement>('#root')
if (rootElement) {
  createRoot(rootElement).render(<App />)
}
