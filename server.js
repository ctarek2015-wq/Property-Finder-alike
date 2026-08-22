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
// Routers
const authRouter = require("./routers/authRouter");
const pagesRouter = require("./routers/pagesRouter");
const propRouter = require("./routers/propRouter");
const appointmentRouter = require("./routers/appointmentRouter");
// Custom Middlewares
const isSignedIn = require("./middlewares/isSignedIn");
const addUserToViews = require("./middlewares/addUserToViews");
const addPropToViews = require("./middlewares/addPropToViews");
// MIDDLEWARES
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public/stylesheets")));
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
app.use(addPropToViews);

// Routes
// Public Routes
app.use("", pagesRouter);
app.use("/auth", authRouter);

// Custom Middleware
app.use(isSignedIn);
// Private Routes
app.use("/properties", propRouter);
app.use("/properties/:id/appointments", appointmentRouter);

//port listening
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
