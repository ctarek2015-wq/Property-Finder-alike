const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authCtrl");
const isSignedIn = require("../middlewares/isSignedIn");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validateRequest");

router.get("/sign-up", authCtrl.signup);
router.post("/sign-up", validateRegister, authCtrl.register);
router.get("/sign-in", authCtrl.signin);
router.post("/sign-in", validateLogin, authCtrl.login);

// PRIVATE ROUTES
router.get("/sign-out", isSignedIn, authCtrl.signout);

module.exports = router;
