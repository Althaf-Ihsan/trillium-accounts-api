const { executeQuery } = require("../config/db");
const getAllIcd = async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id);

    let query = `SELECT DIAGNOSIS_ID, ICD_ID_ONE, ICD_ID_TWO, ICD_ID_THREE, ICD_ID_FOUR, ICD_ID_FIVE, ICD_ID_SIX, ICD_ID_SEVEN, ICD_ID_EIGHT, ICD_CODE_ONE, ICD_CODE_TWO, ICD_CODE_THREE, ICD_CODE_FOUR, ICD_CODE_FIVE, ICD_CODE_SIX, ICD_CODE_SEVEN, ICD_CODE_EIGHT, ICD_CODE_ONE_DESCRIPTION, ICD_CODE_TWO_DESCRIPTION, ICD_CODE_THREE_DESCRIPTION, ICD_CODE_FOUR_DESCRIPTION, ICD_CODE_FIVE_DESCRIPTION, ICD_CODE_SIX_DESCRIPTION, ICD_CODE_SEVEN_DESCRIPTION, ICD_CODE_EIGHT_DESCRIPTION FROM ${process.env.SCHEMA} WHERE PATIENT_ID= ? `;
    const results = await executeQuery(query, [id]);
    const data = results.map((item) => {
      return {
        visitDiagnosisId: item.DIAGNOSIS_ID,
        dx1: {
          icdId: item.ICD_ID_ONE,
          icdCode: item.ICD_CODE_ONE,
          icdDescription: item.ICD_CODE_ONE_DESCRIPTION,
          rangeId: 0,
        },
        dx2: {
          icdId: item.ICD_ID_TWO,
          icdCode: item.ICD_CODE_TWO,
          icdDescription: item.ICD_CODE_TWO_DESCRIPTION,
          rangeId: 0,
        },
        dx3: {
          icdId: item.ICD_ID_THREE,
          icdCode: item.ICD_CODE_THREE,
          icdDescription: item.ICD_CODE_THREE_DESCRIPTION,
          rangeId: 0,
        },
        dx4: {
          icdId: item.ICD_ID_FOUR,
          icdCode: item.ICD_CODE_FOUR,
          icdDescription: item.ICD_CODE_FOUR_DESCRIPTION,
          rangeId: 0,
        },
        dx5: {
          icdId: item.ICD_ID_FIVE,
          icdCode: item.ICD_CODE_FIVE,
          icdDescription: item.ICD_CODE_FIVE_DESCRIPTION,
          rangeId: 0,
        },
        dx6: {
          icdId: item.ICD_ID_SIX,
          icdCode: item.ICD_CODE_SIX,
          icdDescription: item.ICD_CODE_SIX_DESCRIPTION,
          rangeId: 0,
        },
        dx7: {
          icdId: item.ICD_ID_SEVEN,
          icdCode: item.ICD_CODE_SEVEN,
          icdDescription: item.ICD_CODE_SEVEN_DESCRIPTION,
          rangeId: 0,
        },
        dx8: {
          icdId: item.ICD_ID_EIGHT,
          icdCode: item.ICD_CODE_EIGHT,
          icdDescription: item.ICD_CODE_EIGHT_DESCRIPTION,
          rangeId: 0,
        },
      };
    });
    const response = {
      responseCode: 0,
      responseType: 0,
      data,
    };
    res
      .status(200)
      .json(
        results.length ? response : {  data: [], message: "data not found" }
      );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getVisitCharge = async (req, res) => {
  try {
    let { id } = req.params;
    let query = `SELECT PROCEDURE_CODE,UNIT,FEE,AMOUNT,POS,TOS,DIAGNOSIS_POINTER1, DIAGNOSIS_POINTER2, DIAGNOSIS_POINTER3, DIAGNOSIS_POINTER4, DIAGNOSIS_POINTER5, DIAGNOSIS_POINTER6, DIAGNOSIS_POINTER7, DIAGNOSIS_POINTER8,MODIFIER1,MODIFIER2,MODIFIER3,MODIFIER4,DESCRIPT,PROCEDURE_ID FROM trilliumv1.visit_procedure WHERE PATIENT_ID=?`;
    const results = await executeQuery(query, [id]);
    const visitServiceDtoList = results.map((item) => {
      return {
        cptcode: item.PROCEDURE_CODE,
        unit: item.UNIT,
        fee: item.FEE,
        amount: item.AMOUNT,
        pos: item.POS,
        tos: item.TOS,
        icdPointer1: item.DIAGNOSIS_POINTER1,
        icdPointer2: item.DIAGNOSIS_POINTER2,
        icdPointer3: item.DIAGNOSIS_POINTER3,
        icdPointer4: item.DIAGNOSIS_POINTER4,
        icdPointer5: item.DIAGNOSIS_POINTER5,
        icdPointer6: item.DIAGNOSIS_POINTER6,
        icdPointer7: item.DIAGNOSIS_POINTER7,
        icdPointer8: item.DIAGNOSIS_POINTER8,
        modifier1: item.MODIFIER1,
        modifier2: item.MODIFIER2,
        modifier3: item.MODIFIER3,
        modifier4: item.MODIFIER4,
        description: item.DESCRIPT,
        cptId: item.PROCEDURE_ID,
      };
    });
    res
      .status(200)
      .json({ responseCode: 0, responseType: 0, visitServiceDtoList });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { getAllIcd, getVisitCharge };
