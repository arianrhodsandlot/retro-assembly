import { Redirect, Route, Switch } from 'wouter'
import { AuthDropbox } from './routes/auth/dropbox'
import { AuthGoogleDrive } from './routes/auth/google-drive'
import { AuthOnedrive } from './routes/auth/onedrive'
import { Home } from './routes/home'
import { LibrarySystemRom } from './routes/library/rom'

export default function App() {
  return (
    <Switch>
      <Route path='/'>
        <Home />
      </Route>

      <Route path='/library/:library/system/:system?'>
        <LibrarySystemRom />
      </Route>
      <Route path='/library/:library/system/:system/rom/:rom'>
        <LibrarySystemRom />
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

      <Route>
        <Redirect to='/' />
      </Route>
    </Switch>
  )
}
