import '../views/styles'
import { createRoot } from 'react-dom/client'
import App from '../views/components/app'
import '../views/lib/global'

const rootElement = document.querySelector<HTMLDivElement>('#root')
if (rootElement) {
  createRoot(rootElement).render(<App />)
}
