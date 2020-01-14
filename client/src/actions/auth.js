import axios from 'axios'
import jwt_decode from 'jwt-decode'
import setToken from '../utilities/setToken'

import {
  SET_CURRENT_USER,
  GET_ERRORS
} from './types'

export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

export const loginUser = userData => dispatch => {
  axios
    .post('/api/login', userData)
    .then(res => {
      const { token } = res.data
      localStorage.setItem('jwtToken', token)
      setToken(token)
      const decoded = jwt_decode(token)
      dispatch(setCurrentUser(decoded))
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

export const logoutUser = () => dispatch => {
  localStorage.removeItem('jwtToken')
  setToken(false)
  dispatch(setCurrentUser({}))
}

