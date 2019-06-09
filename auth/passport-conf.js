const passportHandlers = {
  signup: (req, username, password, done) => {
    console.log(req.body);
    global.mysql.query(
      "insert into users (username, password) values(?,?)",
      [username, password],
      (err, user) => {
        if (err) {
          return done(err);
        }
        return done(null, { username, password });
      }
    );
  },
  login: (username, password, done) => {
    console.log(username, password);
    global.mysql.query(
      "SELECT * FROM users WHERE username=? AND password=?",
      [username, password],
      function(err, user) {
        console.log("-------------------------", err, user);
        if (err) {
          return done(err);
        }
        if (user.length === 0) {
          return done(null, false, { message: "User not found" });
        }
        if (user[0].password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user[0]);
      }
    );
  },
  serializeUser: (user, done) => {
    done(null, user);
  },
  deserializeUser: (user, done) => {
    done(null, user);
  },
  validatedUser: (req, res, next) => {
    console.log("-----------------", req.user);
    if (req.isAuthenticated()) {
      return next();
    }
    return res.sendStatus(401);
  }
};

module.exports = passportHandlers;
