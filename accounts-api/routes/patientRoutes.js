const express = require("express");
const { getAllPatient, savePatient, deletePatient, updatePatient, getPatientByName, changeStatus, getPatientPayment } = require("../controller/patientController");
const router = express.Router();

router.get("/account/list/range",getAllPatient );
router.get('/account/patient',getPatientByName)
router.get('/account/patient/bal',getPatientPayment)
router.post("/account/patient/save",savePatient)
router.patch('/account/patient/update/:id',updatePatient)
router.delete("/account/patient/delete/:id",deletePatient)
router.patch("/account/patient/status/:id",changeStatus)
module.exports = router;
