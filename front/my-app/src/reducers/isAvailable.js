export const isAvailable = (state = null, action) => {
      switch(action.type) {
        case 'IS_AVAILABLE':
        return action.payload
         default:
          return state;
      }
    }

export default isAvailable;
