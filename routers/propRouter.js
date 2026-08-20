const express = require("express");
const router = express.Router();
const propCtrl = require("../controllers/propCtrl");

router.get("/", propCtrl.index);
router.get("/new", propCtrl.newProp);
router.post("/", propCtrl.create);
router.get("/:id", propCtrl.show);
router.get("/:id/edit", propCtrl.edit);
router.put("/:id", propCtrl.update);
router.delete("/:id", propCtrl.deleteProp);

module.exports = router;
