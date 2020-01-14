import {
  UPDATE_FIELD_AUTH,
  LOGIN_PAGE_UNLOADED
} from './types'

export const onChangeEmail = () => (value) => dispatch => {
  dispatch({
    type: UPDATE_FIELD_AUTH,
    key: 'email',
    value
  })
}

export const onChangePassword = () => (value) => dispatch => {
  dispatch({
    type: UPDATE_FIELD_AUTH,
    key: 'password',
    value
  })
}

export const onUnload = () => dispatch => {
  dispatch({
    type: LOGIN_PAGE_UNLOADED
  })
}
