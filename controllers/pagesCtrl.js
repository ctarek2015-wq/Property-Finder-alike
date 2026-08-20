const home = async (req, res) => {
  try {
    if (!req.session) {
      return res.render("index.ejs");
    }
    const role = req.session.user.role;

    if (role === "seeker") {
      return res.render("index.ejs", { role: "seeker" });
    }
    if (role === "owner") {
      return res.redirect("/owners/properties");
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { home };
