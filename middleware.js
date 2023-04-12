const { JoiSchema, JoiReview } = require('./utilities/schemas');
const useError = require('./utilities/Error');
const Campground = require('./models/campground');
const Review = require("./models/review");

//check if the user is authenticated
module.exports.isUser = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.origin = req.originalUrl;
        //show user the state of an authentication
        req.flash('error', 'Please login or sign up');
        return res.redirect('/users/login');
    }
    next();
} 

//check whether the data in the form passes the requirements for the database 
module.exports.validateCampground = (req, res, next) => {
  const { error } = JoiSchema.validate(req.body);

  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(",");
    throw new useError(errorMessage, 400);
  } else next();
};

//check permissions to modify any camp data
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "Insufficient permissions");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};


//check whether the data in the review passes the requirements for the database 
module.exports.validateReview = (req, res, next) => {
  const { error } = JoiReview.validate(req.body);

  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(",");
    throw new useError(errorMessage, 400);
  } else next();
};

//check permissions to modify any review
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewID } = req.params;
  const review = await Review.findById(reviewID);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "Insufficient permissions");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};