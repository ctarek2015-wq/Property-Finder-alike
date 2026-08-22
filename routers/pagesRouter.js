const express = require("express");
const router = express.Router();
const pagesCtrl = require("../controllers/pagesCtrl");

router.get("/", pagesCtrl.home);

module.exports = router;
