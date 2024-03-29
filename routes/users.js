const express = require('express'),
      router = express.Router(),
      passport = require('passport');
      
const catchAsync = require('../utilities/CatchAsync');
const users = require('../controllers/users');

//chaining the requests for the registration
router.route("/register")
  .get((req, res) => res.render("users/register"))
  .post(catchAsync(users.register));

//chaining the requests for the login
router.route("/login")
  .get((req, res) => res.render("users/login"))
  .post(passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/users/login",
    }),
    users.checkLogIn
  );
  
router.get('/logout', users.checkLogOut);

module.exports = router;