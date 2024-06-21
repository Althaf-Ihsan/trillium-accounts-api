const express = require("express");
const { getAllCharges} = require("../controller/chargesController");
const router = express.Router();

router.get("/account/charge/list/:id",getAllCharges );
// router.get('/account/patient',getPatientByName)
// router.post("/account/patient/save",savePatient)
// router.patch('/account/patient/update/:id',updatePatient)
// router.delete("/account/patient/delete/:id",deletePatient)
module.exports = router;
