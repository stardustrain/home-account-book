import { SCOPES } from '../constants/apiConfig'
import credential from '../client_secret.json'

const { client_id, api_key, discovery_docs } = credential

export const initializeGoogleClient = (callback: VoidFunction, toggleState: VoidFunction) => () => {
  window.gapi.client.init({
    apiKey: api_key,
    clientId: client_id,
    discoveryDocs: discovery_docs,
    scope: SCOPES
  }).then(() => {
    const googleAuthInstance = window.gapi.auth2.getAuthInstance()
    googleAuthInstance.isSignedIn.listen(updateSigninStatus)
    updateSigninStatus(googleAuthInstance.isSignedIn.get(), toggleState)
    callback()
  })
}

const updateSigninStatus = (isSignedIn: boolean, toggleState: VoidFunction) => {
  if (isSignedIn) {
    toggleState()
    return
  }
  toggleState()
}