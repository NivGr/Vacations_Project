const _ = require('lodash');

const validateLoginFieldsExist = (req, res, next) => {
  try{
    if(_.isEqual(_.keys(req.body), ['username', 'password'])) {
      return next()
    }
    return res.sendStatus(400)
  }
  catch(err) {
    return res.sendStatus(400)
  }
}

const validateLoginFieldsNotEmpty = (req, res, next) => {
  try{
    return next()
  }
  return res.sendStatus(400);
  catch(err) {
    return res.sendStatus(400)
  }
}


//returns object instead of callback wtf
module.exports = {
  validateLoginFieldsExist,
  validateLoginFieldsNotEmpty
}
