import { Route } from 'wouter'
import { AuthGoogleDrive } from './routes/auth/google-drive'
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
      <Route path='/auth/googledrive'>
        <AuthGoogleDrive />
      </Route>
    </>
  )
}
