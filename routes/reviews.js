const express = require('express'),
      router = express.Router({ mergeParams: true });

const Review = require('../models/review'),
      Campground = require('../models/campground');

const { JoiReview } = require('../utilities/schemas'),
      catchAsync = require('../utilities/CatchAsync'),
      useError = require('../utilities/Error');

const validateReview = (req, res, next) => {
    const { error } = JoiReview.validate(req.body);
    
    if(error) {
        const errorMessage = error.details.map(el => el.message).join(',');
        throw new useError(errorMessage, 400);
    } else next();
};

router.post('/', validateReview, catchAsync( async(req, res, next) => {
    const campground = await Campground.findById( req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review created');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewID', catchAsync( async(req, res, next) => {
    const { id, reviewID } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: {reviews: reviewID} });
    await Review.findByIdAndDelete(req.params.id);
    req.flash('success', 'Review deleted');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;