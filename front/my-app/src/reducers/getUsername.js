export const getUsername = (state = '', action) => {
      switch(action.type) {
        case 'GET_USERNAME':
        return action.payload //returns username
         default:
          return state;
      }
    }

export default getUsername;
