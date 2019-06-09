import axios from 'axios';

export const signupUser = userDetails => {
  return dispatch => axios.put('http://localhost:4000/vacations/api/signup',userDetails).then(({data}) => {
  }).catch(err => console.log(err))
}

export const checkAvailabilty = username => {
  return dispatch => axios.get(`http://localhost:4000/vacations/api/checkAvailability/${username}`).then(({data}) => {
    if(data.length > 0) {dispatch(isAvailable(false))}
    else {
      dispatch(isAvailable(true))
    }
  }).catch(err => console.log(err))
}

export const loginUser = userCredentials => {
  return dispatch => axios.post('http://localhost:4000/vacations/api/login',userCredentials).then(({data}) => {
    if(data !== 'Invalid User/Pass') {
      dispatch(isLoginSuccess(true));
      dispatch(isAdmin(data.isAdmin));
      dispatch(getUsername(data.username));
      dispatch(getUserId(data.userId));
      // dispatch(getCookie(data.cookieHash));
    }
    else {
      dispatch(isLoginSuccess(false));
    }
  }).catch(err => dispatch(isLoginSuccess(false)))
}

export const checkCookie = () => {
  return dispatch => axios.get('http://localhost:4000/vacations/api/check').then(({data}) => {
    dispatch(getCookie(data))
  }).catch(err => console.log(err))
}

export const isAvailable = availableStatus => {
  return {
    type: 'IS_AVAILABLE',
    payload: availableStatus
  }
}

export const getCookie = userId => {
  return {
    type: 'GET_COOKIE',
    payload: userId
  }
}

export const getUsername = username => {
  return {
    type: 'GET_USERNAME',
    payload: username
  }
}

export const getUserId = userId => {
  return {
    type: 'GET_USERID',
    payload: userId
  }
}

export const isLoginSuccess = bool => {
  return {
    type: 'IS_LOGIN_SUCCESSFUL',
    payload: bool
  }
}

export const isAdmin = flag => {
  return {
    type: 'IS_ADMIN',
    payload: flag
  }
}

export const getAllVacations = () => {
  return dispatch => axios.get('http://localhost:4000/vacations/api/main').then(({data}) => {
    dispatch(sendVacationReq(data));
    dispatch(isAdmin(data.isAdmin));
    dispatch(getUsername(data.username));
    dispatch(getUserId(data.userId))
  }).catch(err => console.log(err))
}

export const sendVacationReq = vacations => {
  return {
    type: 'SEND_VACATIONS',
    payload: vacations
  }
}

export const followVacation = (userId, vacationId, checked) => {
  return dispatch => axios.patch('http://localhost:4000/vacations/api/main/user', ({userId: userId, vacationId: vacationId, checked: checked})).then(({data}) => {
    dispatch(getAllVacations());
  }).catch(err => console.log(err))
}

export const deleteVacation = vacationId => {
  return dispatch =>  axios.patch(`http://localhost:4000/vacations/api/main/delete/${vacationId}`).then(({data}) => {
      dispatch(getAllVacations())
  }).catch(err => console.log(err))
}

export const addVacation = vacationData => {
  return dispatch => axios.put('http://localhost:4000/vacations/api/main/', vacationData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(({data}) => {
    dispatch(getAllVacations());
  }).catch(err => console.log(err))
}

export const editVacation = (dataForm,id) => {
  return dispatch => axios.patch(`http://localhost:4000/vacations/api/main/edit/${id}`, dataForm, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(({data}) => {
    dispatch(getAllVacations());
  }).catch(err => console.log(err))
}

export const logout = () => {
  return dispatch => axios.get('http://localhost:4000/vacations/api/logout').then(({data}) => {
    dispatch(isLoginSuccess(false));
    dispatch(checkCookie())
  }).catch(err => console.log(err))
}

export const getLoginCreds = (username, password) => {
  return {
    type: 'GET_CRED',
    payload: [username, password]
  }
}
