const _ = require('lodash');

const getAllVacations = req => {
  return new Promise(async (res, rej) => {
    try{
      const results = await global.sql.query(`select v.Vacation_ID, v.Destination, v.Description, DATE_ADD(v.From_Date, INTERVAL 1 DAY) From_Date, DATE_ADD(v.To_Date, INTERVAL 1 DAY) To_Date, v.Price, v.Image, v.NumOfFollowers
                                              from vacations v
                                              where delete_date is null
                                              order by Update_Date desc`);
      return res(results);
    }
    catch(err) {
      return rej()
    }
  })
}

const addNewVacation = req => {
  const image = req.files.picture.name;
  const {description, destination, fromDate, toDate, price} = JSON.parse(req.body.vacationDetails);
  return new Promise(async (res, rej) => {
    try{
      await global.sql.query(addNewVacationQueryBuilder(), [description, destination, fromDate, toDate, price, image]);
      return res();
    }
    catch(err) {
      console.log(err)
      return rej();
    }
  })
}

const addNewVacationQueryBuilder = () => {
  const addNewVacQuery = `insert into vacations (Description, Destination, From_Date, To_Date, Price, Image, Update_Date, Create_Date)
                          values (?, ?, ?, ?, ?, ?, substring(SYSDATE(),1,10), substring(SYSDATE(),1,10))`;
 return addNewVacQuery;
}


//function for sending to calidation - check for duplicates
const getAllDescriptionsForValidation = (req) => {
  return new Promise(async (res, rej) => {
    try{
      const [results] = await global.sql.query(`select description, destination, from_date, to_date, price, image
                                                from vacations
                                                where description = ?`,[req.body.description]);
      return res(results);
    }
    catch(err) {
      return rej();
    }
  })
}

const getUserIdFromCookie = req => {
  return new Promise(async(res, rej) => {
    try{
      const [results] = await global.sql.query(`select userId from cookies where cookieHash = ?`, [req.cookies['connect.sid']]);
      return res(results)
    }
    catch(err) {
      return rej()
    }
  })
}

//edit vacation service by admin
const editVacation = req => {
  return new Promise(async(res, rej) => {
    const {vacationId} = req.params;
    const {description, destination, fromDate, toDate, price} = JSON.parse(req.body.vacationDetails);
    let image;
    if(!_.isEmpty(req.files)) {
      image = req.files.picture.name;      
    }
    console.log(image)
    try{
      if(!_.isEmpty(req.files)) {
        await global.sql.query(editVacationQueryBuilder(req), [description, destination, fromDate, ''+toDate, price, image, vacationId]);
        return res()
      }
      await global.sql.query(editVacationQueryBuilder(req), [description, destination, fromDate, ''+toDate, price, vacationId]);
      return res()
     }
    catch(err){
      console.log(err)
      return rej()
    }
  })
}

//query for vacation editing by admin
const editVacationQueryBuilder = req => {
  if(!_.isEmpty(req.files)) {
    const updateQueryString = 'update vacations set description = ?, destination = ?, from_date = ?, to_date = ?, price = ?, image = ?, update_date = substring(sysdate(),1,10) where Vacation_ID = ?';
    return updateQueryString;
  }
  const updateQueryString = 'update vacations set description = ?, destination = ?, from_date = ?, to_date = ?, price = ?, update_date = substring(sysdate(),1,10) where Vacation_ID = ?';
  return updateQueryString;
}

//delete vacation by admin by id (params)
const deleteVacation = req => {
  const {vacationId} = req.params;
  return new Promise(async(res, rej) => {
    try{
      await global.sql.query(deleteVacationQueryBuilder(),[vacationId]);
      return res();
    }
    catch(err){
      console.log(err)
      return rej();
    }
  })
}

//query for vacation delete by admin --  actually update the delete_date col
const deleteVacationQueryBuilder = () => {
  const deleteVacationQueryString = `update vacations set delete_date = substring(sysdate(),1,10), update_date = substring(sysdate(),1,10)WHERE Vacation_ID = ?`;
  return deleteVacationQueryString;
}


//user patch - FOLLOW/UNFOLLOW
const followVacation = req => {
  //better to get from body than params - security issue
  const {vacationId, userId, checked} = req.body;
  return new Promise(async (res, rej) => {
    try{ // add promise.all here
        await Promise.all([global.sql.query(followVacationQueryBuilder(checked), [vacationId]), global.sql.query(addRemoveUserVacationConnection(checked), [vacationId, userId])]);
        // await global.sql.query(addRemoveUserVacationConnection(checked), [vacationId, userId]);
        return res()
    }
    catch(err) {
      console.log(err)
      return rej();
    }
  })
}

const getMyFollowed = req => {
  const myCookie = req.cookies['connect.sid'];
  return new Promise(async(res, rej) => {
    try{
      const followed = await global.sql.query(getMyFollowedQueryBuilder(), [myCookie]);
      return res(followed);
    }
    catch(err) {
      return rej();
    }
  })
}

const userData = req => {
  const myCookie = req.cookies['connect.sid'];
  return new Promise(async(res, rej) => {
    try{
      const isAdmin = await global.sql.query('select isAdmin, Username, u.userId from users u join cookies c on c.userId = u.userId where c.cookieHash = ?',[myCookie]);
      return res(isAdmin);
    }
    catch(err) {
      return rej()
    }
  })
}

const getMyFollowedQueryBuilder = () => {
  const getFollowedQuery = `select u.* from users_vacation u join cookies c on u.user_id = c.userId where delete_date is null and c.cookieHash = ?`;
  return getFollowedQuery;
}

const followVacationQueryBuilder = checked => {
  if(checked) {
      const addFollowerQuery = `update vacations set NumOfFollowers = NumOfFollowers + 1 where vacation_id = ?`;
      return addFollowerQuery;
  }
  else {
    const substractFollowerQuery = `update vacations set NumOfFollowers = NumOfFollowers - 1 where vacation_id = ?`;
    return substractFollowerQuery;
  }
}

const addRemoveUserVacationConnection = checked => {
  if(checked) {
    const addToUserVacationConnect = `insert into users_vacation (Vacation_Id, User_Id) values (?, ?)`;
    return addToUserVacationConnect;
  }
  else {
    const removeFromUserVacationConnect = `update users_vacation set delete_date = substring(sysdate(),1,10) where Vacation_Id = ? and User_Id = ?`;
    return removeFromUserVacationConnect;
  }
}

module.exports = {
  getAllVacations,
  addNewVacation,
  editVacation,
  deleteVacation,
  getMyFollowed,
  followVacation,
  getAllDescriptionsForValidation,
  getUserIdFromCookie,
  userData
}
