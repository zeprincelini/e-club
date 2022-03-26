const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect("/auth/sign-in");
  }
};

const isAuthorized = (req, res, next) => {
  if (req.session.isAuthenticated) {
    res.redirect("/");
  } else {
    next();
  }
};

module.exports = { isAuthenticated, isAuthorized };
