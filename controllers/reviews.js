const Review = require("../models/review"),
  Campground = require("../models/campground");

//finding the campground in the db and associating new reviews with it
module.exports.createReview = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  //show the creation result to the user
  req.flash("success", "Review created");
  res.redirect(`/campgrounds/${campground._id}`);
};

//finding the campground in the db and deleting associated reviews
module.exports.deleteReview = async (req, res) => {
  const { id, reviewID } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
  await Review.findByIdAndDelete(reviewID);
  //show the deletion result to the user
  req.flash("success", "Review deleted");
  res.redirect(`/campgrounds/${id}`);
};