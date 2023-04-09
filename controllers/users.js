const User = require("../models/user");

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email: email, username: username });
    const regUser = await User.register(user, password);
    req.login(regUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp!");
      res.redirect("/campgrounds");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("back");
  }
};

module.exports.checkLogIn = (req, res) => {
  req.flash("success", "Welcome back");
  const url = res.locals.origin ? res.locals.origin : "/campgrounds";
  delete res.locals.origin;
  res.redirect(url);
};

module.exports.checkLogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You now have logged out");
    res.redirect("/campgrounds");
  });
};