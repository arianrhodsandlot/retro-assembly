import { Route } from 'wouter'
import { AuthOnedrive } from './routes/auth/onedrive'
import { Home } from './routes/home'

export default function App() {
  return (
    <>
      <Route path='/'>
        <Home />
      </Route>
      <Route path='/auth/onedrive'>
        <AuthOnedrive />
      </Route>
    </>
  )
}
