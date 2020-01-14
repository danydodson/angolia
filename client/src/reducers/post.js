import {
  ADD_POST,
  ADD_COMMENT,
  POSTS_LOADING,
  GET_POST,
  GET_POSTS,
  POST_LOADING,
  GET_POSTS_BY_HANDLE,
  GET_POSTS_BY_CATEGORY,
  SET_POSTS_FILTER,
  POST_PAGE_LOADED,
  POST_PAGE_UNLOADED,
  USERS_POSTS_LOADING,
  DELETE_POST,
  DELETE_COMMENT
} from '../actions/types'

const initialState = {
  posts: [],
  post: {},
  loading: false
}

export default function (state = initialState, action) {
  switch (action.type) {

    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };

    case GET_POST:
      return {
        ...state,
        post: action.payload,
        loading: false
      }

    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      }

    case POST_LOADING:
      return {
        ...state,
        loading: true
      }

    case POSTS_LOADING:
      return {
        ...state,
        loading: true
      }

    case USERS_POSTS_LOADING:
      return {
        ...state,
        loading: true
      }

    case GET_POSTS_BY_HANDLE:
      return {
        ...state,
        posts: action.payload,
        loading: false
      }

    case GET_POSTS_BY_CATEGORY:
      return {
        ...state,
        posts: action.payload,
        loading: false
      }

    case SET_POSTS_FILTER:
      return {
        ...state,
        posts: action.payload,
        loading: false
      }

    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload)
      };

    case POST_PAGE_LOADED:
      return {
        ...state,
        POST: action.payload[0].POST,
        notes: action.payload[1].notes
      }

    case POST_PAGE_UNLOADED:
      return {}

    case ADD_COMMENT:
      return {
        ...state,
        noteErrors: action.error ? action.payload.errors : null,
        notes: action.error ? null : (state.notes || []).concat([action.payload.note])
      }

    case DELETE_COMMENT:
      const noteId = action.noteId
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== noteId)
      }

    default:
      return state
  }
}
