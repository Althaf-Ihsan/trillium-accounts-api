const express = require("express");
const { getAllIcd,getVisitCharge } = require("../controller/diagnosisController");
const router = express.Router();
//get patient diagnosis code
router.get("/account/visit/icd/:id",getAllIcd )

router.get("/account/visit/charge/:id",getVisitCharge)
module.exports = router;
