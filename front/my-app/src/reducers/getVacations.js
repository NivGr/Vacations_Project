export const getVacations = (state = [], action) => {
      switch(action.type) {
        case 'SEND_VACATIONS':
        return [action.payload] //returns true/false if user is admin
         default:
          return state;
      }
    }

export default getVacations;
