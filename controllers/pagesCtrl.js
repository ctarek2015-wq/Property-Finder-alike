const home = async (req, res) => {
  try {
    return res.render("index.ejs");
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { home };
