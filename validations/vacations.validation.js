const _ = require('lodash');
const vacationsService = require('../services/vacations.service.js');

//validate all fields are present
const checkAllFieldsPresent = (req, res, next) => {
  if(_.filter(_.keys(req.body), x => x === 'id').length === 0) {
    if(_.isEqual(_.keys(JSON.parse(req.body.vacationDetails)),['description', 'destination', 'fromDate', 'toDate', 'price']) &&
        req.files.picture.name !== '' ) {
      return next()
    }
    return res.status(400).json('Not All Columns Entered!')
  }
  else{
    if(_.isEqual(_.keys(req.body.vacationDetails),['id', 'description', 'destination', 'fromDate', 'toDate', 'price']) &&
        req.files.picture.name !== '') {
      return next()
    }
    console.log(2)
    return res.status(400).json('Not All Columns Entered!')
  }
}

const checkAllFieldsNotEmpty = (req, res, next) => {
  if(_.filter(_.omit(JSON.parse(req.body.vacationDetails),['id','price']), x => x === '').length === 0 &&
      JSON.parse(req.body.vacationDetails).price !== null &&
      req.files.picture.name !== '') {
    return next()
  }
  console.log(2)
  return res.sendStatus(400)
}

//validate from_date < to_date
const checkDateRange = (req, res, next) => {
  if(req.body.fromDate > req.body.toDate) {
    console.log(3)
    return res.status(400).json('Nigga you cant travel back in time');
  }
  return next();
}


//validate cookie hash
const validateCookie = async (req, res, next) => {
  try{
    const myCookie = await vacationsService.getUserIdFromCookie(req);
    if(_.isEmpty(myCookie)){
      return res.status(404).json('No cookie found!')
    }
    // const [results, fields] = await global.sql.query('select cookieHash from cookies where cookieHash = ?', [req.cookies['connect.sid']]);
    // console.log(results)
    // console.log(fields)
    return next()
  }
  catch(err) {
    return res.sendStatus(400)
  }
}

//edit existingvacation by admin validation
//check if vacation exitst
const checkVacationIdExists = async (req, res, next) => {
  const {vacationId} = req.params;
  try{
    const allVacations = await vacationsService.getAllVacations(req);
    const parsedVacations = JSON.parse(JSON.stringify(allVacations[0]));
    const existingVacationIds = _.filter(parsedVacations, x => parseInt(x.Vacation_ID) === parseInt(vacationId));
    if(existingVacationIds.length === 0) {
      console.log(5)
      return res.status(400).json('Vacation ID not found!')
    }
    return next();
  }
  catch(err) {
    console.log(5)
    return res.sendStatus(400)
  }
}

module.exports = {
  checkAllFieldsPresent,
  validateCookie,
  checkAllFieldsNotEmpty,
  checkDateRange,
  checkVacationIdExists,
  checkAllFieldsNotEmpty
}
