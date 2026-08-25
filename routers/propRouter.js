const express = require("express");
const router = express.Router();
const propCtrl = require("../controllers/propCtrl");
const { validateProperty } = require("../middlewares/validateRequest");
const { uploadImages } = require("../middlewares/upload");

router.get("/", propCtrl.index);
router.get("/new", propCtrl.newProp);
router.post("/", uploadImages, validateProperty, propCtrl.create);
router.get("/:id", propCtrl.show);
router.get("/:id/edit", propCtrl.edit);
router.put("/:id", uploadImages, validateProperty, propCtrl.update);
router.delete("/:id", propCtrl.deleteProp);

module.exports = router;
