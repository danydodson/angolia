import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createBrowserHistory } from 'history'
import axiosMiddleware from 'redux-axios-middleware'
import axios from 'axios'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import reducer from './reducers'

export const history = createBrowserHistory()

const initialState = {}

const client = axios.create({
  baseURL: 'http://localhost:5000/api',
  responseType: 'json'
})

const middleware = [routerMiddleware(history), axiosMiddleware(client), thunk, logger]

const store = createStore(
  reducer(history),
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store

