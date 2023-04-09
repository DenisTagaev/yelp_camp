const express = require('express'),
      router = express.Router({ mergeParams: true });
      
const { validateReview, isUser, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utilities/CatchAsync');
const reviews = require('../controllers/reviews');

router.post('/', isUser, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewID', isUser, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;