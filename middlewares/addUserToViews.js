const addUserToViews = (req, res, next) => {
  const user = req.session.user;
  if (user) {
    res.locals.user = user;
    console.log(user);
  } else {
    res.locals.user = null;
  }
  next();
};

module.exports = addUserToViews;
