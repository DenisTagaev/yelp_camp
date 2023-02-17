const express = require('express'),
      router = express.Router();

const Campground = require('../models/campground');
const { isUser } = require('../middleware');

const { JoiSchema } = require('../utilities/schemas'),
      catchAsync = require('../utilities/CatchAsync'),
      useError = require('../utilities/Error');

const validateCampground = (req, res, next) => {
    const { error } = JoiSchema.validate(req.body);
    
    if(error) {
        const errorMessage = error.details.map(el => el.message).join(',');
        throw new useError(errorMessage, 400);
    } else next();
    
};

router.get('/', catchAsync( async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.post('/', isUser, validateCampground, catchAsync( async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Campground created');
    res.redirect(`campgrounds/${campground._id}`);
}));

router.get('/new', isUser, (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', isUser, catchAsync( async(req, res, next) => {
    const campground = await Campground.findById( req.params.id).populate('reviews');
    campground ? res.render('campgrounds/show', { campground }) : 
    req.flash('error', 'Campground not found') && res.redirect('/campgrounds');
}));

router.get('/:id/edit', isUser, catchAsync( async(req, res, next) => {
    const campground = await Campground.findById( req.params.id);
    campground ? res.render('campgrounds/edit', { campground }) : 
    req.flash('error', 'Campground not found / updated') && res.redirect('/campgrounds');

}));

router.put('/:id', isUser, validateCampground,  catchAsync( async(req, res, next) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {...req.body.campground});
    req.flash('success', 'Campground updated');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id', isUser, catchAsync( async(req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Campground deleted');
    res.redirect('/campgrounds');
}));

module.exports = router;