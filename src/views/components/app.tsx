import { Redirect, Route, Switch } from 'wouter'
import { routes } from '../lib/routes'
import { AuthDropbox } from './routes/auth/dropbox'
import { AuthGoogleDrive } from './routes/auth/google-drive'
import { AuthOnedrive } from './routes/auth/onedrive'
import { UniversalHomeRoute } from './routes/universal-home-route'

export default function App() {
  return (
    <Switch>
      <Route path={routes.home}>
        <UniversalHomeRoute />
      </Route>

      <Route path={routes.platform}>
        <UniversalHomeRoute />
      </Route>
      <Route path={routes.rom}>
        <UniversalHomeRoute />
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
        <Redirect to={routes.home} />
      </Route>
    </Switch>
  )
}
