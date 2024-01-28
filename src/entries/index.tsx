import '../views/styles'
import { createRoot } from 'react-dom/client'
import App from '../views/components/app'
import '../views/lib/global'

const rootElement = document.querySelector<HTMLDivElement>('#root')
if (rootElement) {
  createRoot(rootElement).render(<App />)
}

// experimental shader support
try {
  const shader = new URL(location.href).searchParams.get('_shader')
  if (shader) {
    if (shader === 'clear') {
      localStorage.removeItem('_shader')
    } else {
      localStorage.setItem('_shader', shader)
    }
  }
} catch {}
