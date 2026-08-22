const express = require("express");
const router = express.Router();
const appointmentCtrl = require("../controllers/appointmentCtrl");

router.get("/", appointmentCtrl.index);
router.get("/new/:id", appointmentCtrl.newAppointment);
router.post("/", appointmentCtrl.create);
router.get("/:id", appointmentCtrl.show);
router.get("/:id/edit", appointmentCtrl.edit);
router.put("/:id", appointmentCtrl.update);
router.delete("/:id", appointmentCtrl.deleteAppointment);

module.exports = router;
