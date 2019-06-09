export const getCookie = (state = '', action) => {
      switch(action.type) {
        case 'GET_COOKIE':
        return action.payload //returns username
         default:
          return state;
      }
    }

export default getCookie;
