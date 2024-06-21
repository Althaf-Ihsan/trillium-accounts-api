const express = require("express");
const { getAllpayments, getLedgerDetails} = require("../controller/paymentController");
const router = express.Router();

router.get("/account/payment/list/:id",getAllpayments );
router.get("/account/payment/ledger/:id",getLedgerDetails)
module.exports = router;
