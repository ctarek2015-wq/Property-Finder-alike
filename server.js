// REQUIRING
require("dotenv").config();
require("./config/database");

const path = require("path");
const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const methodOverride = require("method-override");
const morgan = require("morgan");
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";
if (isProduction) {
  app.set("trust proxy", 1);
}
// Routers
const authRouter = require("./routers/authRouter");
const pagesRouter = require("./routers/pagesRouter");
const propRouter = require("./routers/propRouter");
const appointmentRouter = require("./routers/appointmentRouter");
const reviewRouter = require("./routers/reviewRouter");
const profileRouter = require("./routers/profileRouter");
// Custom Middlewares
const isSignedIn = require("./middlewares/isSignedIn");
const addUserToViews = require("./middlewares/addUserToViews");
const addPropToViews = require("./middlewares/addPropToViews");
// MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
    },
  }),
);
app.use(morgan("dev"));
app.use(addUserToViews);
app.use(addPropToViews);

// Routes
// Public Routes
app.use("", pagesRouter);
app.use("/auth", authRouter);

// Custom Middleware
// Protect private routes
app.use(isSignedIn);
// Private Routes
app.use("/properties", propRouter);
app.use("/appointments", appointmentRouter);
app.use("/reviews", reviewRouter);
app.use("/profile", profileRouter);

// Start server outside production
app.listen(port, "0.0.0.0", () => {
  console.log(`The express app is ready on port ${port}!`);
});

module.exports = app;
