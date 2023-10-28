import { Route, Switch } from 'wouter'
import { AuthDropbox } from './routes/auth/dropbox'
import { AuthGoogleDrive } from './routes/auth/google-drive'
import { AuthOnedrive } from './routes/auth/onedrive'
import { Home } from './routes/home'
import { System } from './routes/system'

export default function App() {
  return (
    <Switch>
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
      <Route path='/system/:system'>
        <System />
      </Route>
      <Route path='/system/:system/rom/:rom'>
        <System />
      </Route>
    </Switch>
  )
}
