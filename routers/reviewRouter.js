const express = require("express");
const router = express.Router();
const reviewCtrl = require("../controllers/reviewCtrl");

router.post("/", reviewCtrl.create);
router.get("/:id/edit", reviewCtrl.edit);
router.put("/:id", reviewCtrl.update);
router.delete("/:id", reviewCtrl.deleteReview);

module.exports = router;
