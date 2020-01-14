import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import setToken from '../../utilities/setToken'
//import jwt_decode from 'jwt-decode'
import store from '../../store'

import LandingPage from '../Pages/Landing'
import LoginPage from '../Pages/Login'
import RegisterPage from '../Pages/Register'
import FixedNavbar from '../Navbars/FixedNavbar'

//import { setCurrentUser, logoutUser } from '../../actions/auth'
//import { clearCurrentProfile } from '../../actions/profile'

//import { APP_LOAD, REDIRECT } from '../../actions/types'

const mapStateToProps = state => {
  return {
    appLoaded: state._common,
    appName: state._common.appName,
    currentUser: state._common.currentUser,
    redirectTo: state._common.redirectTo
  }
}

// const mapDispatchToProps = dispatch => ({
//   onLoad: (payload) =>
//     dispatch({ type: APP_LOAD, payload, skipTracking: true }),
//   onRedirect: () =>
//     dispatch({ type: REDIRECT })
// })

class App extends Component {

  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      store.dispatch(push(nextProps.redirectTo))
      this.props.onRedirect()
    }
  }

  componentWillMount() {
    const token = window.localStorage.getItem('jwt')
    if (token) setToken(localStorage.jwtToken)

    //const decoded = jwt_decode(localStorage.jwtToken)
  //  store.dispatch(setCurrentUser(decoded))

    //const currentTime = Date.now() / 1000
    //if (decoded.exp < currentTime) {
      //store.dispatch(logoutUser())
      //store.dispatch(clearCurrentProfile())
      //window.location.href = '/users/login'
    //}
  }

  render() {
    if (this.props.appLoaded) {
      return (
        <div className='App'>
          <FixedNavbar
            appName={this.props.appName}
            currentUser={this.props.currentUser} />
          <Switch>
            <Route exact path='/' component={LandingPage} />
            <Route exact path='/login' component={LoginPage} />
            <Route exact path='/register' component={RegisterPage} />
          </Switch>
        </div>
      )
    }
    return <FixedNavbar
      appName={this.props.appName}
      currentUser={this.props.currentUser} />
  }
}

export default connect(mapStateToProps)(App)
