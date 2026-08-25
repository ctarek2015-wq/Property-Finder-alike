const express = require("express");
const router = express.Router();
const reviewCtrl = require("../controllers/reviewCtrl");
const { validateReview } = require("../middlewares/validateRequest");

router.post("/", validateReview, reviewCtrl.create);
router.get("/:id/edit", reviewCtrl.edit);
router.put("/:id", validateReview, reviewCtrl.update);
router.delete("/:id", reviewCtrl.deleteReview);

module.exports = router;
