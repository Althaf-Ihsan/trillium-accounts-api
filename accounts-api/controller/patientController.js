const { executeQuery } = require("../config/db");
const getAllPatient = async (req, res) => {
  try {
    let {
      start,
      limit,
      dob,
      firstName,
      lastName,
      mrn,
      phone,
      facilityId,
      providerId,
      status,
    } = req.query;
    start = Math.max(parseInt(start) || 0);
    limit = Math.max(parseInt(limit) || 20);
    let query = `SELECT PATIENT_ID,LAST_NAME,FIRST_NAME,DOB,MRN,PHONE,ACTIVE,FACILITY_NAME,PROVIDER_NAME,LAST_DOS,INS_BALANCE,PRIMARY_PAYER_NAME,MIDDLE_NAME,SEX,COUNTRY,STATE,BILLING_METHOD,ADDRESS_LINE1,ADDRESS_LINE2,EMAIL,ZIP,CITY FROM ${process.env.SCHEMA}`;
    let conditions = [],
      parameters = [];
    const filters = {
      DOB: dob,
      FIRST_NAME: firstName,
      LAST_NAME: lastName,
      MRN: mrn,
      PHONE: phone,
      FACILITY_NAME: facilityId,
      PROVIDER_NAME: providerId,
      ACTIVE: status,
    };
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        conditions.push(`${key} = ?`);
        parameters.push(value);
      }
    });

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    const results = await executeQuery(query, parameters);
    const data = results.map((item) => {
      return {
        id: item.PATIENT_ID,
        firstName: item.FIRST_NAME,
        lastName: item.LAST_NAME,
        middleName: item.MIDDLE_NAME,
        mrn: item.MRN,
        facilityName: item.FACILITY_NAME,
        phone: item.PHONE,
        providerName: item.PROVIDER_NAME,
        active: item.ACTIVE,
        dob: item.DOB,
        insuranceBalance: item.INS_BALANCE,
        ldos: item.LAST_DOS,
        payorName: item.PRIMARY_PAYER_NAME,
        email: item.EMAIL,
        sex: item.SEX,
        city:item.CITY,
        country: item.COUNTRY,
        state: item.STATE,
        zip: item.ZIP,
        addressLine1: item.ADDRESS_LINE1,
        addressLine2: item.ADDRESS_LINE2,
        policyType: item.BILLING_METHOD,
      };
    });
    const response = {
      responseCode: 0,
      responseType: 0,
      data: {
        start: start,
        limit: limit,
        totalrecords: results.length,
        results: data.slice(start, start + limit),
      },
    };
    return res.json(results.length ? response : { message: "data not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const savePatient = async (req, res) => {
  try {
    const {
      clinicId,
      firstName,
      middleName,
      lastName,
      dob,
      mrn,
      phone,
      sex,
      email,
      addressLine1,
      addressLine2,
      policyType,
      city,
      state,
      country,
      zip,
    } = req.body;

    const query = `
      INSERT INTO ${process.env.SCHEMA} (
        CLINIC_ID,
        FIRST_NAME,
        MIDDLE_NAME,
        LAST_NAME,
        DOB,
        MRN,
        MOBILE,
        SEX,
        EMAIL,
        ADDRESS_LINE1,
        ADDRESS_LINE2,
        BILLING_METHOD,
        CITY,
        STATE,
        COUNTRY,
        ZIP
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?
      );
    `;

    const queryParams = [
      clinicId,
      firstName,
      middleName,
      lastName,
      dob,
      mrn,
      phone,
      sex,
      email,
      addressLine1,
      addressLine2,
      policyType,
      city,
      state,
      country,
      zip,
    ];

    // Assuming executeQuery is a function that executes the SQL query
    const results = await executeQuery(query, queryParams);

    const response = {
      responseCode: 0,
      responseType: 0,
      data: {
        message: "Patient added successfully",
      },
    };

    return res.json(
      results.affectedRows ? response : { message: "Data not inserted" }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updatePatient = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      dob,
      mrn,
      phone,
      sex,
      email,
      addressLine1,
      addressLine2,
      policyType,
      city,
      state,
      country,
      zip
    } = req.body;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    const query = `
        UPDATE ${process.env.SCHEMA}
        SET
          FIRST_NAME = ?,
          MIDDLE_NAME = ?,
          LAST_NAME = ?,
          DOB = ?,
          MRN=?,
          MOBILE = ?,
          SEX = ?,
          EMAIL = ?,
          ADDRESS_LINE1 = ?,
          ADDRESS_LINE2 = ?,
          BILLING_METHOD = ?,
          CITY = ?,
          STATE = ?,
          COUNTRY = ?,
          zip=?
        WHERE PATIENT_ID = ?;
      `;

    const queryParams = [
      firstName,
      middleName,
      lastName,
      dob,
      mrn,
      phone,
      sex,
      email,
      addressLine1,
      addressLine2,
      policyType,
      city,
      state,
      country,
      zip,
      id,
    ];

    const results = await executeQuery(query, queryParams);
    const response = {
      responseCode: 0,
      responseType: 0,
      data: {
        message: "Patient updated successfully",
        affectedRows: results.affectedRows,
      },
    };
    if (results.affectedRows > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "Patient not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deletePatient = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid patient ID" });
  }
  const query = `DELETE FROM ${process.env.SCHEMA} WHERE PATIENT_ID = ?`;
  try {
    const results = await executeQuery(query, [id]);
    const response = {
      responseCode: 0,
      responseType: 0,
      data: {
        message: "Patient deleted successfully",
        affectedRows: results.affectedRows,
      },
    };
    if (results.affectedRows > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ error: "Patient not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getPatientByName = async (req, res) => {
  try {
    const { firstName, lastName } = req.query;
    if (!firstName && !lastName) {
      return res
        .status(400)
        .json({ error: "Please provide a first name or last name" });
    }

    let query = `SELECT LAST_NAME, FIRST_NAME
                     FROM ${process.env.SCHEMA} WHERE `;
    const parameters = [];

    if (firstName) {
      query += "FIRST_NAME = ?";
      parameters.push(firstName);
    }

    if (lastName) {
      if (firstName) query += " OR ";
      query += "LAST_NAME = ?";
      parameters.push(lastName);
    }

    const results = await executeQuery(query, parameters);
    const data = results.map((item) => {
      return {
        firstName: item.FIRST_NAME,
        lastName: item.LAST_NAME,
      };
    });
    const response = {
      responseCode: 0,
      responseType: 0,
      data: {
        results: data,
      },
    };
    return res.json(results.length ? response : { message: "data not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    console.log(status);
    if (!id) {
      return res.status(400).json({ error: "Please provide id" });
    }

    let query = `UPDATE ${process.env.SCHEMA} SET ACTIVE=? WHERE PATIENT_ID = ?;
 `;
    const results = await executeQuery(query, [status, id]);
    const response = {
      responseCode: 0,
      responseType: 0,
      data: {
        results: id,
      },
    };
    return res.json(
      results.affectedRows > 0 ? response : { message: "data not found" }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const getPatientPayment = async (req, res) => {
  try {
    const { patientId } = req.body;
    console.log(patientId)
    if (!patientId) {
      return res
        .status(400)
        .json({ error: "Please provide patientId" });
    }

    let query = `SELECT 
    c.PATIENT_PENDING,
    c.PRIMARY_PAID,
    c.SECONDARY_PAID,
    c.TERTIARY_PAID,
    c.PATIENT_PAID 
FROM 
    patient p
JOIN 
    trilliumv1.claim c 
ON 
    c.PATIENT_ID = p.PATIENT_ID  
WHERE 
    p.PATIENT_ID = ?;
 `;
    const parameters = [  patientId];


  
    const results = await executeQuery(query, parameters);
    const data = results.map((item) => {
      return {
         patBalance:item.PATIENT_PENDING,
         paid:item.PRIMARY_PAID+item.SECONDARY_PAID+item.TERTIARY_PAID+item.PATIENT_PAID
      };
    });
    const response = {
      responseCode: 0,
      responseType: 0,
      data: {
        results: data,
      },
    };
    return res.json(results.length ? response : { message: "data not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  getAllPatient,
  savePatient,
  deletePatient,
  updatePatient,
  getPatientByName,
  changeStatus,
  getPatientPayment
};
