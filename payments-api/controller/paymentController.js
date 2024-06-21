const { executeQuery } = require("../config/db");
require("dotenv").config();
const getAllpayments = async (req, res) => {
  try {
    let { id } = req.params;
    let query = `SELECT 
    c.BILLED, 
    c.ADJUSTMENT, 
    c.CLAIM_ID, 
    c.DOS,
    vp.PROCEDURE_CODE,
    vp.PROCEDURE_ID,
    vp.PRIMARY_PAID,
    vp.SECONDARY_PAID,
    vp.TERTIARY_PAID,
    vp.PATIENT_PAID
    FROM 
    claim c
    JOIN 
    visit_procedure vp ON c.CLAIM_ID = vp.CLAIM_ID
    WHERE 
    c.PATIENT_ID = ?`;
    let parameters = [id];
    const results = await executeQuery(query, parameters);
    const data = results.map((item, index) => {
      return {
        billed: item.BILLED,
        adjustment: item.ADJUSTMENT,
        claimId: item.CLAIM_ID,
        paid:
          item.PRIMARY_PAID +
          item.SECONDARY_PAID +
          item.TERTIARY_PAID +
          item.PATIENT_PAID,
        balance:
          item.BILLED -
          (item.PRIMARY_PAID +
            item.SECONDARY_PAID +
            item.TERTIARY_PAID +
            item.PATIENT_PAID),
        procedureCode: item.PROCEDURE_CODE,
        procedure_Id: item.PROCEDURE_ID,
        dos: item.DOS,
      };
    });
    const response = {
      responseCode: 0,
      responseType: 0,
      data: {
        results: data,
      },
    };
    return res.json(
      results.length ? response : { data: [], message: "data not found" }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getLedgerDetails = async (req, res) => {
  try {
    let { id } = req.params;
    let query =
      "SELECT RESP_PARTY AS party,ENTRY_DATE AS createdDate,AMOUNT AS amount,TYPE AS type,DATE AS postedDate FROM trilliumv1.ledger WHERE PROCEDURE_ID=?";
    let parameters = [id];
    const results = await executeQuery(query, parameters);
    const response = {
      responseCode: 0,
      responseType: 0,
      data: {
        results: results,
      },
    };
    return res.json(results.length ? response : {data:[], message: "data not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { getAllpayments, getLedgerDetails };
