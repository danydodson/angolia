import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import auth from './auth'
import common from './common'
import errors from './errors'
import post from './post'

export default (history) => combineReducers({
  _auth: auth,
  _common: common,
  _errors: errors,
  _post: post,
  router: connectRouter(history)
})
