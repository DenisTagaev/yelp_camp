const catchAsync = require('../utilities/CatchAsync'),
      { storage } = require('../utilities/cloudinary');

const express = require('express'),
      router = express.Router(),
      multer = require('multer'),
      upload = multer({ storage });
      
const campgrounds = require('../controllers/campgrounds');

const { isUser, validateCampground, isAuthor } = require('../middleware');



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(
      isUser,
      upload.array('image'),
      validateCampground,
      catchAsync(campgrounds.createCampground)
      );
      
router.get('/new', isUser, campgrounds.newCampground);

router
  .route('/:id')
  .get(catchAsync(campgrounds.campgroundDetails))
  .put(
    isUser,
    isAuthor,
    upload.array('image'),
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