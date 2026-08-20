const home = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.render("index.ejs");
    }
    if (req.session.user.role === "seeker") {
      return res.render("index.ejs", { role: "seeker" });
    }
    if (req.session.user.role === "owner") {
      return res.redirect("/owners/properties");
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { home };
