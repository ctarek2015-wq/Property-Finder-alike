const express = require("express");
const router = express.Router({ mergeParams: true });
const appointmentCtrl = require("../controllers/appointmentCtrl");

router.get("/", appointmentCtrl.index);
router.get("/new", appointmentCtrl.newAppointment);
router.post("/", appointmentCtrl.create);
router.get("/:appointmentId", appointmentCtrl.show);
router.get("/:appointmentId/edit", appointmentCtrl.edit);
router.put("/:appointmentId", appointmentCtrl.update);
router.delete("/:appointmentId", appointmentCtrl.deleteAppointment);

module.exports = router;
