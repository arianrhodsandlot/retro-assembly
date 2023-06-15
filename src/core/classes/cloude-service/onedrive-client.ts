class OnedriveClient {
  private accessToken: string

  private constructor({ accessToken }) {
    this.accessToken = accessToken
  }

  async getInstance() {
    await this.loadGapi()
  }

  async loadGapi() {
    await new Promise((resolve) => gapi.load('client', resolve))
    await gapi.client.init({ apiKey, discoveryDocs })
    gapi.client.setToken({ access_token: this.accessToken })
  }

  getAuthorizeUrl() {
    const query = {
      client_id: clientId,
      scope,
      response_type: 'token',
      redirect_uri: redirectUri,
    }
    return queryString.stringifyUrl({ url: authorizeUrl, query })
  }

  isRetrievingAccessToken() {
    const { access_token: accessToken } = queryString.parse(location.hash)
    return typeof accessToken === 'string'
  }

  retrieveToken() {
    if (!this.isRetrievingAccessToken()) {
      throw new TypeError('token is empty')
    }

    const { access_token: accessToken, error, error_description: errorDescription } = queryString.parse(location.hash)
    if (error) {
      throw new Error(`error: ${error}, error description: ${errorDescription}`)
    } else if (typeof accessToken === 'string') {
      this.accessToken = accessToken
    } else {
      throw new TypeError(`invalide code. code: ${accessToken}`)
    }
  }

  async validateAccessToken() {
    if (!this.accessToken) {
      return false
    }

    await this.loadGapi()
    try {
      await gapi.client.drive.files.list({ pageSize: 1, fields: 'files(id)' })
    } catch (error) {
      console.warn(error)
      return false
    }
    return true
  }
}
