import { Client } from '@microsoft/microsoft-graph-client'
import ky from 'ky'
import queryString from 'query-string'
import { oneDriveAuth } from '../constants/auth'

const client = Client.init({
  authProvider(done) {
    done(undefined, localStorage.getItem('access_token'))
  },
  fetchOptions: {
    credentials,
  },
})
window.client = client

const { clientId, scope, redirectUri, codeChallenge } = oneDriveAuth
function selectOneDrive() {
  const url = queryString.stringifyUrl({
    url: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    query: {
      client_id: clientId,
      scope,
      response_type: 'code',
      redirect_uri: redirectUri,
      code_challenge: codeChallenge,
    },
  })
  location.assign(url)
}

async function redeem() {
  const { code, error, error_description: errorDescription } = queryString.parse(location.search)
  if (error) {
    console.log({ error, errorDescription })
    return
  }
  if (!code || typeof code !== 'string') {
    return
  }
  const result = await ky
    .post('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      body: new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        code,
        grant_type: 'authorization_code',
        code_verifier: codeChallenge,
      }),
    })
    .json<any>()
  localStorage.setItem('access_token', result.access_token)
  localStorage.setItem('refresh_token', result.refresh_token)
}
