// REQUIRING
require("dotenv").config();
require("./config/database");

const path = require("path");
const express = require("express");
const app = express();
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const methodOverride = require("method-override");
const morgan = require("morgan");
const port = process.env.PORT || 3000;

const isSignedIn = require("./middlewares/isSignedIn");
const addUserToViews = require("./middlewares/addUserToViews");

// Routers
const authRouter = require("./routers/authRouter");
const pagesRouter = require("./routers/pagesRouter");

// MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  }),
);
app.use(morgan("dev"));
app.use(addUserToViews);

// Routes
app.use("", pagesRouter);
app.use("/auth", authRouter);

//Public Routes

// Custom Middleware

app.use(isSignedIn);
//Private Routes

app.get("/protected", isSignedIn, (req, res) => {
  res.send(`you are in as ${req.session.user.username}`);
});
//port listening
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
