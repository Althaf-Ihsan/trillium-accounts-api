const { executeQuery } = require("../config/db");
const getAllfiles = async (req, res) => {
  try {
    let { id } = req.params;
    console.log(id)
    let parameters = [id];
    let query = `SELECT IMAGE_ID,FILE_NAME,FILE_TYPE,IMAGE_TYPE from  ${process.env.SCHEMA} WHERE PATIENT_ID=?  `;
    const results = await executeQuery(query, parameters);
    const data = results.map((file) => ({
      imageId: file.IMAGE_ID,
      fileName: file.FILE_NAME,
      fileType: file.FILE_TYPE,
      imageType: file.IMAGE_TYPE,
      filePath:`${req.protocol}://${req.get("host")}/uploads/${file.FILE_NAME}`,
    }));

   
    return res.json(
      results.length ? data : { data:[],message: "data not found" }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: 1,
      responseType: 1,
      data: [],
      error: "Internal Server Error",
      accessToken: null,
    });
  }
};
const addFiles = async (req, res) => {
  try {
    const { patientId, fileType, imageTitle, imageNotes, clinicId } = req.body;
console.log(req.file)
    // Ensure a file is uploaded
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded!' });
    }

    const fileName = req.file.filename;


    const query = `INSERT INTO ${process.env.SCHEMA} (PATIENT_ID, FILE_NAME, FILE_TYPE, IMAGE_TITLE, IMAGE_NOTES, CLINIC_ID, IMAGE_DATE) VALUES (?, ?, ?, ?, ?, ?, NOW())`;

    // Execute the query
    await executeQuery(query, [
      patientId,
      fileName,
      fileType.substring(0,3),
      imageTitle || "",
      imageNotes || "",
      clinicId,
    ]);

    res.status(201).json({
      responseCode: 0,
      responseType: 0,
      data: { message: "File uploaded successfully" },
      error: null,
      accessToken: null,
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({
      responseCode: 1,
      responseType: 1,
      data: [],
      error: "Internal Server Error",
      accessToken: null,
    });
  }
};


const deleteFile = async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM ${process.env.SCHEMA} WHERE IMAGE_ID = ?`;
  try {
    if (!id) {
      return res.status(401).json({ message: "image id required" });
    }
    const results = await executeQuery(query, [id]);
    const response = {
      responseCode: 0,
      responseType: 0,
      data:{
      message:"file deleted successfully",
      },
      error: null,
      accessToken: null,
    };

    return res.status(200).json(response);
  } catch (error) {
    const response = {
      responseCode: 1,
      responseType: 1,
      data: [],
      error: error.message,
      accessToken: null,
    };

    return res.status(500).json(response);
  }
};

module.exports = { getAllfiles, addFiles, deleteFile };
