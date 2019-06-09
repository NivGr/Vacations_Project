const _ = require('lodash');

const userSignup = (req, res) => {
  const {first, last, username, password, passwordAuth} = req.body;
  if(password === passwordAuth) {
    return new Promise(async (res, rej) => {
      try{
        await global.sql.query(signupQueryBuilder(), [first, last, username, password])
      }
      catch(err) {
        console.log(err)
        return rej()
      }
      return res()
    })
  }
  res.json('Password validation not OK').status(400)
}

//query builder for signup service
const signupQueryBuilder = () => {
  const signupQuery = `insert into users (First_Name, Last_Name, Username, Password) values (?, ?, ?, ?)`;
  return signupQuery;
}

//query to send to validation
const validateIfUserExists = req => {
  const {username} = req.body;
  return new Promise(async (res, rej) => {
    try{
      const [results, fields] = await global.sql.query(`select count(*) as count from users where Username = ?`, [username]);
        return res(results);
      }
    catch(err) {
      return rej()
    }
  })
}

const checkAvailabilty = req => {
  const {username} = req.params;
  return new Promise(async (res, rej) => {
    try{
      const [results] = await global.sql.query(`select username from users u where username = ?`, [username]);      
      return res(results)
    }
    catch(err) {
      return rej()
    }
  })
}

module.exports = {
  userSignup,
  validateIfUserExists,
  checkAvailabilty
}
