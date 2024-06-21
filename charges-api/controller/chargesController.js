const { executeQuery } = require("../config/db");
const getAllCharges = async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id);
    let query = `SELECT 
        c.DOS,
        c.STATUS,
        c.APPOINTMENT_TYPE,
        c.BILLED,
        c.FACILITY_NAME,
        vp.PROCEDURE_CODE,
        vd.ICD_CODE_ONE,
        c.PROVIDER_NAME
        FROM 
        trilliumv1.claim c
        JOIN 
        trilliumv1.visit_procedure vp ON c.CLAIM_ID = vp.CLAIM_ID
        JOIN
        trilliumv1.visit_diagnosis vd ON c.VISIT_ID = vd.VISIT_ID
        WHERE 
        c.PATIENT_ID = ?`;
    let parameters = [];
    parameters.push(id);
    const results = await executeQuery(query, parameters);
    const response = {
      responseCode: 0,
      responseType: 0,
      data: results
    };
    return res.json(results.length ? response : { data: [], message: "data not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { getAllCharges };
