const requireAuth = (req, res, next) => {
    if (!req.session.user) {
      // If user is not logged in, redirect to login page
      return res.redirect('/login');
    }
    // If user is logged in, allow access to the route
    next();
};

module.exports = requireAuth 