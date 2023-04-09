const express = require('express'),
      router = express.Router();
    
const catchAsync = require('../utilities/CatchAsync');

const { isUser, validateCampground, isAuthor } = require('../middleware');

const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(
      isUser,
      validateCampground,
      catchAsync(campgrounds.createCampground)
      );
      
router.get('/new', isUser, campgrounds.newCampground);

router
  .route("/:id")
  .get(catchAsync(campgrounds.campgroundDetails))
  .put(
    isUser,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(
    isUser, 
    isAuthor, 
    catchAsync(campgrounds.deleteCampground)
  );


router.get('/:id/edit', isUser, isAuthor, catchAsync(campgrounds.editCampground));

module.exports = router;