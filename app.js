// Hide development keys from the public
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
/* package dependencies */
const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      path = require('path'),
      methodOverride = require('method-override'),
      EjsTemplates = require('ejs-mate'),
      session = require('express-session'),
      flash = require('connect-flash'),
      passport = require('passport'),
      LocalPass = require('passport-local');

/*routes*/
const campgroundsRoutes = require('./routes/campgrounds'),
      reviewsRoutes = require('./routes/reviews'),
      usersRoutes = require('./routes/users');

/*utils*/
const useError = require('./utilities/Error');

/* models */
const User = require('./models/user');

const sessionConfig = { 
    secret: 'sessionKey',
    resave: false, 
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => console.log('Mongo is CONNECTED'))
    .catch(err => console.log(err));

app.engine('ejs', EjsTemplates);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.use(flash());

/*passport stuff*/
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalPass( User.authenticate() ));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* set cookies */
app.use((req, res, next) => {
    req.session.origin ? res.locals.origin = req.session.origin : null; 
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.fail = req.flash('error');
    next();
});

/*routes handlers */
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);
app.use('/users', usersRoutes);

/* start page */
app.get('/', (req, res) => {
    res.render('home');
});

/* error route */
app.all('*', (req, res, next) => {
    next(new useError('Page Not Found'), 404);
});

/* error handling */
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message='Something went wrong';
    res.status(statusCode).render('err', { err });
});

app.listen(3000, () => 'App is listening on port 3000');