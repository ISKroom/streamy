import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import streamReducer from './streamReducer';

// store that associated to the reducer: reducerName
export default combineReducers({
  auth: authReducer,
  form: formReducer,
  streams: streamReducer
});
