const express = require('express'),
      router = express.Router(),
      passport = require('passport'),
      User = require('../models/user'),
      catchAsync = require('../utilities/CatchAsync');

router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async(req, res, next) => {
    try{
        const { email, username, password } = req.body;
        const user = new User({ email: email, username: username });
        const regUser = await User.register(user, password);
        req.login(regUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp!');
            res.redirect('/campgrounds');
        });
    } catch(err) {
        req.flash('error', err.message);
        res.redirect('back');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login'}), (req, res) => {
    req.flash('success', 'Welcome back');
    const url = res.locals.origin ? res.locals.origin : '/campgrounds' ;
    delete res.locals.origin;
    res.redirect(url);
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash('success', 'You now have logged out');
        res.redirect('/campgrounds');
    });
});

module.exports = router;