export const getUserId = (state = 0, action) => {
      switch(action.type) {
        case 'GET_USERID':
        return action.payload //returns username
         default:
          return state;
      }
    }

export default getUserId;
