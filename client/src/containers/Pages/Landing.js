import React, { Component } from 'react'
import { Helmet } from "react-helmet"
import { connect } from 'react-redux'

import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
} from '../../actions/types'

const mapStateToProps = state => ({
  ...state.home,
  appName: state._common.appName
})

const mapDispatchToProps = dispatch => ({
  onLoad: (payload) => dispatch({ type: HOME_PAGE_LOADED, payload }),
  onUnload: () => dispatch({ type: HOME_PAGE_UNLOADED })
})

class LandingPage extends Component {

  componentWillMount = () => this.props.onLoad()
  componentWillUnmount = () => this.props.onUnload()

  render() {
    return (
      <React.Fragment>
        <Helmet>
          <title>Landing</title>
        </Helmet>
        <div>Landing Page</div>
      </React.Fragment>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LandingPage)