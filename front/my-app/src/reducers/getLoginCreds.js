export const getLoginCreds = (state = [], action) => {
      switch(action.type) {
        case 'GET_CREDS':
        return action.payload //returns username
         default:
          return state;
      }
    }

export default getLoginCreds;
