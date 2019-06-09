export const isAdmin = (state = null, action) => {
      switch(action.type) {
        case 'IS_ADMIN':
        return action.payload //returns true/false if user is admin
         default:
          return state;
      }
    }

export default isAdmin;
