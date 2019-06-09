const express = require('express');
const router = express.Router();

//login service + validation
const loginService = require('../services/login.service.js');
const loginValidation = require('../services/login.service.js');

//signup service + validation
const signupService = require('../services/signup.service.js');
const signupValidation = require('../validations/signup.validation.js');

//all vacations GET
const vacationsService = require('../services/vacations.service.js');
const vacationsValidation = require('../validations/vacations.validation.js');


router.get('/check', async(req, res) => {
  try{
    const userId = await vacationsService.getUserIdFromCookie(req);
    return res.status(200).json(userId)
  }
  catch(err) {
    return res.sendStatus(400)
  }
})

router.get('/checkAvailability/:username', async(req, res) => {
  try{
    const username = await signupService.checkAvailabilty(req)
    return res.status(200).json(username)
  }
  catch(err) {
    console.log(err)
    return res.sendStatus(400)
  }
})

router.post('/login', async(req, res) => {
  try{
    const userData = await loginService.loginUser(req);
    await loginService.writeCookie(userData.userId, req);
    res.json({isAdmin:userData.isAdmin, cookieHash: userData.cookieHash, username: userData.username, userId: userData.userId}).status(200);
  }
  catch(err) {
    res.json('Invalid User/Pass').status(400);
  }
})

router.put('/signup', signupValidation.isExists, signupValidation.isAllinReq, signupValidation.checkCredentialsTypes, signupValidation.passwordValidation, async(req, res) => {
  try{
    await signupService.userSignup(req);
    res.json(req.body).status(200);
  }
  catch(err) {
    console.log(err)
    res.sendStatus(400);
  }
})


//when user logs in - he'll get both vacations list AND his followed list conatined
router.get('/main', vacationsValidation.validateCookie, async(req, res) => {
  try{
    //promise all- user will get all vacations and HIS followed vacations
    const [vacations, followed, userData] = await Promise.all([vacationsService.getAllVacations(req), vacationsService.getMyFollowed(req), vacationsService.userData(req)]);
    return res.status(200).json({vacations: vacations[0], followed: followed, isAdmin: userData[0][0].isAdmin, username: userData[0][0].Username, userId: userData[0][0].userId});
  }
  catch(err) {
    console.log(err)
    return res.sendStatus(400)
  }
})


//add vacation by admin
router.put('/main', vacationsValidation.checkAllFieldsPresent,  vacationsValidation.checkAllFieldsNotEmpty, vacationsValidation.checkDateRange,  async(req, res) => {
  try{
    //handle the file upload
    let uploadFile = req.files.picture
    const fileName = req.files.picture.name
    // ${__dirname}/public
    uploadFile.mv(
      `./front/my-app/build/uploads/${fileName}`
    )
    //handle the entire upload
    await vacationsService.addNewVacation(req);
    return res.status(200).json('Vacation Added!')
  }
  catch(err) {
    console.log(err)
    res.sendStatus(400)
  }
})


//edit existing vacation by admin
router.patch('/main/edit/:vacationId'/*,vacationsValidation.checkVacationIdExists, vacationsValidation.checkAllFieldsPresent*/, async(req, res) => {
  try{
    //handle the file upload
    if(req.files !== null) {
      let uploadFile = req.files.picture
      const fileName = req.files.picture.name
      // ${__dirname}/public
      uploadFile.mv(
        `./front/my-app/build/uploads/${fileName}`
      )
    }
    //handle the entire upload
    await vacationsService.editVacation(req);
    return res.status(200).json('Vacation Edited!')
  }
  catch(err){
    console.log(err)
    return res.sendStatus(400);
  }
})


//delete existing vacation by admin - not actually deleting but updating delete_date
router.patch('/main/delete/:vacationId', vacationsValidation.checkVacationIdExists, async(req, res) => {
  try{
    await vacationsService.deleteVacation(req);
    return res.status(200).json('Vacation Delete_Date Updated!!')
  }
  catch(err){
    console.log(err)
    return res.sendStatus(400);
  }
})


//USER PATCH - FOLLOW/UNFOLLOW -- will get id on params for patching and "checked" on body- t/f to add or substract from followers column in vacations table
router.patch('/main/user/', async(req, res) => {
  try{
    await vacationsService.followVacation(req);
    console.log(req.body.checked)
    if(req.body.checked){
      return res.status(200).json('Vacation Followed!');
    }
    else{
      return res.status(200).json('Vacation Unfollowed!')
    }
  }
  catch(err) {
    return res.sendStatus(400)
  }
})

//USER d
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err) {
      res.sendStatus(400);
    }
    res.sendStatus(200);
  });
})

module.exports = router;
