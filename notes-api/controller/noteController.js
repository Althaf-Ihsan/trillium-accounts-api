
const { executeQuery } = require("../config/db");
const getAllNotes = async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id)
      let parameters = [];
      let query=`SELECT PATIENT_NOTE_ID,NOTE,CREATED_DATE FROM ${process.env.SCHEMA} `
      parameters.push(id)
      query+=`WHERE PATIENT_ID=?`
    const results = await executeQuery(query, parameters);
    const response = {
      responseCode: 0,
      responseType: 0,
      data: results
    };
    return res.json(results.length ? response : { data:[], message: "data not found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const addNote = async (req, res) => {
  try {
    const { clinic_id, patient_id, notes } = req.body;
    const query = `INSERT INTO ${process.env.SCHEMA} (PATIENT_ID, CLINIC_ID,USER_ID,CREATED_DATE,HIDDEN, NOTE) VALUES (?, ?, 0, CURRENT_TIMESTAMP,0,?)`;
    const parameters = [patient_id, clinic_id, notes];
    const results = await executeQuery(query, parameters);
    if (results.affectedRows > 0) {
      return res.status(201).json({ message: "Note added successfully",results:results});
    } else {
      return res.status(400).json({ message: "Failed to add note" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `DELETE FROM ${process.env.SCHEMA} WHERE PATIENT_NOTE_ID = ?`;
    const parameters = [id]; 
    await executeQuery(query, parameters);
    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { getAllNotes,addNote,deleteNote };
