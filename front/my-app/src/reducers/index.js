import {combineReducers} from 'redux';
import isLoginSuccess from './isLoginSuccess.js';
import isAdmin from './isAdmin.js';
import getVacations from './getVacations.js';
import getUsername from './getUsername.js';
import getUserId from './getUserId.js';
import getCookie from './getCookie.js';
import isAvailable from './isAvailable.js';
import getLoginCreds from './getLoginCreds.js';

export default combineReducers({
  isLoginSuccess,
  isAdmin,
  getUsername,
  getUserId,
  getCookie,
  getVacations,
  isAvailable,
  getLoginCreds
})
