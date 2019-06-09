const _ = require('lodash');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

//writing new cookies
const writeCookie = (userId, req) => {
  return new Promise(async (res, rej) => {
    try{
      //check for existing cookie:
      const myHash = await global.sql.query('select cookieHash from cookies where userId = ? and cookieHash = ?',[userId, req.cookies['connect.sid']]);
      if(myHash[0].length > 0) {
        return res();
      }
      else{
        await global.sql.query('insert into cookies (userId, cookieHash) values (?, ?)',[userId, `${req.cookies['connect.sid']}`]);
        return res();
      }
    }
    catch(err){
      return rej(err)
    }
  })
}

const loginUser = req => {
  const {username, password} = req.body;
  return new Promise(async (res, rej) => {
    try{
      const userData = await global.sql.query(loginQueryBuilder(), [username, password]);
      if(userData[0].length > 0) {
        return res(userData[0][0]);
      }
      else{
        return rej();
      }
    }
    catch(err) {
      return rej()
    }
  })
}

//query builder for login service
const loginQueryBuilder = () => {
  const loginQuery = `select u.userId, u.username, isAdmin, cookieHash from users u left join cookies c on c.userId = u.userId where username = ? and password = ?`;
  return loginQuery;
}


module.exports = {
  loginUser,
  writeCookie
}
