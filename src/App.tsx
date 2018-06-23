import { find } from 'lodash'
import * as React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  NavLink
} from 'react-router-dom'

import LivingCardPage from './LivingCardPage'
import CreditCardPage from './CreditCardPage'

import { initializeGoogleClient } from './utils/googleApi'
import { GOOGLE_API_URL } from './constants/apiConfig'
import './App.css'

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
    const { auth, loadGapi } = this.state
    return (
      <Router>
        <div className="App">
          <Redirect from="/" to="/living-account" />
          <header className="App-header">
            <NavLink to="/living-account">living account</NavLink>
            <NavLink to="/credit-card">credit card</NavLink>
            <button onClick={this.handleAuth}>
              {auth ? '로그아웃' : '로그인'}
            </button>
          </header>
            {loadGapi && (
              <div className="App__contents">
                <Route path="/living-account" component={LivingCardPage} />
                <Route path="/credit-card" component={CreditCardPage} />
              </div>
            )}
        </div>
      </Router>
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
