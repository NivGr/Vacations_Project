const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const _ = require('lodash');
const mysql = require('mysql2/promise');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const vacationsRouter = require('./controllers/vacations.controller.js');
const session = require('express-session');
const fileUpload = require('express-fileupload');

const path = require('path');

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(cookieParser());

//connect front (REACT) and back for build!

//handling cookie creation
app.use(session({
  secret:'my secret',
  saveUninitialized:true,
  resave:false,
  cookie:{
    maxAge:1000*60*100,
    httpOnly:true,
    secure:false
  }
})); //req.cookies['connect.sid']

app.use(express.static('./front/my-app/build'));
// app.use(express.static(path.join(__dirname, './front/my-app/build')));

app.use('/vacations/api', vacationsRouter);

const listen = () => {
  app.listen(80, () => {
    console.log('Server Up! port 4000')
  })
}

const init = async () => {
  try{
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'vacation_app'
    })
    global.sql = connection;
    listen();
  }
  catch(err) {
    console.log(err)
  }
}

//use front file (REACT)

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, './front/my-app/build/', 'index.html'))
})

init();
