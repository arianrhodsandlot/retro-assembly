import { Route } from 'wouter'
import { AuthDropbox } from './routes/auth/dropbox'
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
      <Route path='/auth/google-drive'>
        <AuthGoogleDrive />
      </Route>
      <Route path='/auth/dropbox'>
        <AuthDropbox />
      </Route>
    </>
  )
}
