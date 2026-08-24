const passError = (req, res, next) => {
  res.locals.errorMsg = req.flash("error");
  res.locals.successMsg = req.flash("success");
  next();
};
module.exports = passError;
