module.exports.isUser = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.origin = req.originalUrl;
        req.flash('error', 'Please login or sign up');
        return res.redirect('/users/login');
    }
    next();
} 