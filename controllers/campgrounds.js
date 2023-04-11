const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'),
  mapboxToken = process.env.MAPBOX_TOKEN,
  mapbox_location = mbxGeocoding({ accessToken: mapboxToken });

const Campground = require("../models/campground"),
  { cloudinary } = require("../utilities/cloudinary");

module.exports.index = async (req, res, next) => {
  //find all campgrounds in the db
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.newCampground = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  
  //receive info from the form
  const campground = new Campground(req.body.campground);
  //receive uploaded urls from the cloudinary
  campground.images = req.files.map(file => ({
    url: file.path,
    filename: file.filename,
  }));
  //receive campground location
  const geoData = await mapbox_location.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send();
  campground.geometry = geoData.body.features[0].geometry;
  //set the author to be the logged in user
  campground.author = req.user._id;
  //save data in the db and show result 
  await campground.save();
  req.flash("success", "Campground created");
  res.redirect(`campgrounds/${campground._id}`);
};

module.exports.campgroundDetails = async (req, res, next) => {
  //retrieve specific campground from the db
  const campground = await Campground.findById(req.params.id)
  //check and retrieve reviews associated with this campground and its author
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    //retrieve the author who published campground
    .populate("author");
  campground
  //on success render found campground
    ? res.render("campgrounds/show", { campground })
    : req.flash("error", "Campground not found") &&
      res.redirect("/campgrounds");
};

module.exports.editCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  campground
  //if campground exists place its data with that from the db
    ? res.render("campgrounds/edit", { campground })
    : req.flash("error", "Campground not found / updated") &&
      res.redirect("/campgrounds");
};

module.exports.updateCampground = async (req, res, next) => {
  //get the uploaded images data
  const images = req.files.map((file) => 
    ({ 
      url: file.path,
      filename: file.filename,
    })
  );
  //if campground exists replace its data with that from the form
  const campground = await Campground.findByIdAndUpdate(req.params.id, {
    ...req.body.campground,
    $push: { images: { $each: images } },
  });
  //if there are any images to delete also destroy them in the cloud
  if(req.body.deleteImages) {
    for(let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename)
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } } 
    });
  }
  req.flash("success", "Campground updated");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Campground deleted");
  res.redirect("/campgrounds");
};