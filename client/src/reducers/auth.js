import {
  SET_CURRENT_USER,
  UPDATE_FIELD_AUTH,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  ASYNC_START,
  LOGIN,
  REGISTER
} from '../actions/types'

import isEmpty from '../utilities/isEmpty'

const initialState = { isAuth: false, user: {} }

export default (state = initialState, action) => {
  switch (action.type) {

    case SET_CURRENT_USER:
      return { ...state, isAuth: !isEmpty(action.payload), user: action.payload }

    case LOGIN_PAGE_UNLOADED:
    case REGISTER_PAGE_UNLOADED:
      return {}

    case ASYNC_START:
      if (action.subtype === LOGIN || action.subtype === REGISTER) {
        return { ...state, inProgress: true }
      }
      break

    case UPDATE_FIELD_AUTH:
      return { ...state, [action.key]: action.value }

    default:
      return state
  }
  return state

}
