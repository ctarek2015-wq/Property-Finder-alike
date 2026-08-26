const express = require("express");
const router = express.Router();
const profileCtrl = require("../controllers/profileCtrl");
const { uploadProfilePic } = require("../middlewares/upload");

router.get("/", profileCtrl.show);
router.post("/profile-pic", uploadProfilePic, profileCtrl.updateProfilePic);
router.post("/password/send-code", profileCtrl.sendResetCode);
router.post("/password/verify", profileCtrl.verifyResetCode);

module.exports = router;
