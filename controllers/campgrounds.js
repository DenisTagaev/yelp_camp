const Campground = require("../models/campground");

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.newCampground = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Campground created");
  res.redirect(`campgrounds/${campground._id}`);
};

module.exports.campgroundDetails = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  campground
    ? res.render("campgrounds/show", { campground })
    : req.flash("error", "Campground not found") &&
      res.redirect("/campgrounds");
};

module.exports.editCampground = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  campground
    ? res.render("campgrounds/edit", { campground })
    : req.flash("error", "Campground not found / updated") &&
      res.redirect("/campgrounds");
};

module.exports.updateCampground = async (req, res, next) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, {
    ...req.body.campground,
  });
  req.flash("success", "Campground updated");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Campground deleted");
  res.redirect("/campgrounds");
};