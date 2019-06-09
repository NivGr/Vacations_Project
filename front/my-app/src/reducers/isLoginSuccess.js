export const isLoginSuccess = (state = [null], action) => {
      switch(action.type) {
        case 'IS_LOGIN_SUCCESSFUL':
        return [action.payload] //returns true/false if login was Successful
         default:
          return state;
      }
    }

export default isLoginSuccess;
