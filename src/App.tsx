import { find } from 'lodash'
import * as React from 'react'

import AccountBook from './AccountBook'

import { initializeGoogleClient } from './utils/googleApi'
import { GOOGLE_API_URL } from './constants/apiConfig'
import './App.css'

import logo from './logo.svg'

interface IState {
  auth: boolean,
  loadGapi: boolean,
}

class App extends React.Component<{}, IState> {
  public state = {
    auth: false,
    loadGapi: false,
  }

  public componentDidMount() {
    this.insertGoogleApiScript()
  }

  public render() {
    const { loadGapi, auth } = this.state
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {loadGapi && auth && <AccountBook />}
        <button onClick={this.handleAuth}>
          {auth ? '로그아웃' : '로그인'}
        </button>
      </div>
    )
  }

  private handleAuth = () => {
    const { auth } = this.state
    if (auth) {
      window.gapi.auth2.getAuthInstance().signOut()
      return
    }
    window.gapi.auth2.getAuthInstance().signIn()
  }

  private insertGoogleApiScript = () => {
    const isExist = !!find(
      document.querySelectorAll('script'),
      (tag: HTMLScriptElement) => tag.dataset.id === 'google-api'
    )

    if (isExist) { return }

    const googleApiScript = document.createElement('script')
    googleApiScript.src = GOOGLE_API_URL
    googleApiScript.dataset.id = 'google-api'
    googleApiScript.onload = () => {
      window.gapi.load('client:auth2', initializeGoogleClient(
        this.setLoadSuccessState,
        this.toggleSigninState
      ))
    }
    const head = document.getElementsByTagName('head')[0]
    head.appendChild(googleApiScript)
  }

  private setLoadSuccessState = () => this.setState({
    loadGapi: true,
  })

  private toggleSigninState = () => this.setState({
    auth: !this.state.auth,
  })
}

export default App
