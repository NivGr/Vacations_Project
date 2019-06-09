const _ = require('lodash');
const signupService = require('../services/signup.service.js');


const passwordValidation = (req, res, next) => {
  try{
    if(req.password === req.passwordAuth) {
      return next()
    }
    return res.status(400).json('password validation failed')
  }
  catch(err) {
    console.log(0)
    return res.status(400).json('password validation failed')
  }
}

const isExists = async (req, res, next) => {
  try{
    countUsers = await signupService.validateIfUserExists(req);
    if(countUsers[0].count === 0 ){
      return next();
    }
    console.log(1)
    return res.status(400).json('User Already Exists');
  }
  catch(err) {
      return res.status(400).json('User Already Exists');
  }
}

const isAllinReq = (req, res, next) => {
  if(_.isEqual(_.keys(_.omit(req.body,['usernameAvailability','validation', 'passwordValid'])), ['first', 'last', 'username', 'password', 'passwordAuth'])) {
    return next()
  }
  console.log(2)
  res.sendStatus(400)
}

const checkCredentialsTypes = (req, res, next) => {
  if(_.every(_.omit(req.body,['usernameAvailability','validation', 'passwordValid']), _.isString)) {
    return next();
  }
  console.log(3)
  res.sendStatus(400)
}

module.exports = {
  isExists,
  isAllinReq,
  checkCredentialsTypes,
  passwordValidation
}
