const { JoiSchema, JoiReview } = require('./utilities/schemas');
const useError = require('./utilities/Error');
const Campground = require('./models/campground');
const Review = require("./models/review");


module.exports.isUser = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.origin = req.originalUrl;
        req.flash('error', 'Please login or sign up');
        return res.redirect('/users/login');
    }
    next();
} 

module.exports.validateCampground = (req, res, next) => {
  const { error } = JoiSchema.validate(req.body);

  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(",");
    throw new useError(errorMessage, 400);
  } else next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "Insufficient permissions");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = JoiReview.validate(req.body);

  if (error) {
    const errorMessage = error.details.map((el) => el.message).join(",");
    throw new useError(errorMessage, 400);
  } else next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewID } = req.params;
  const review = await Review.findById(reviewID);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "Insufficient permissions");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};