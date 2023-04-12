// Hide development keys from the public
if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
/* package dependencies */
const express = require("express"),
  app = express(),
  mongoose = require("mongoose"),
  path = require("path"),
  methodOverride = require("method-override"),
  EjsTemplates = require("ejs-mate"),
  session = require("express-session"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalPass = require("passport-local"),
  mongoSanitize = require("express-mongo-sanitize"),
  helmet = require("helmet"),
  MongoDBStore = require("connect-mongo");

/*routes*/
const campgroundsRoutes = require('./routes/campgrounds'),
      reviewsRoutes = require('./routes/reviews'),
      usersRoutes = require('./routes/users');

/*utils*/
const useError = require('./utilities/Error');

/* models */
const User = require('./models/user');

// for local connections
// const dbUrl = "mongodb://localhost:27017/yelp-camp";
const dbUrl = process.env.DB || "mongodb://localhost:27017";
//connect to the MongoDB server locale or remote and store the session data
mongoose.connect(dbUrl)
    .then(() => console.log('Mongo is CONNECTED'))
    .catch(err => console.log(err));
  
const secret = process.env.SECRET;
const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24*3600,
  crypto: {
    secret
  }
});
//show error in the process of deployment
store.on('error', e => console.log('Session error', e));

const sessionConfig = { 
    store,
    name: 'Camp?strange',
    secret,
    resave: false, 
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

//define middlewares to use on the backend
app.engine('ejs', EjsTemplates);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.use(flash());

// Sanitizing requests 
app.use(mongoSanitize({
    replaceWith: '_'
}));

app.use(helmet());

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/npm/",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/npm/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dmon3plvd/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

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