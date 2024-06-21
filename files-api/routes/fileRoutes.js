const express = require("express");
const multer = require("multer");
const { getAllfiles, addFiles, deleteFile } = require("../controller/fileController");
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage }); 


// Route to get all files
router.get("/account/patient/files/:id", getAllfiles);

// Route to upload a file
router.post('/account/patient/files/upload', upload.single('file'), addFiles);

// Route to delete a file
router.delete('/account/patient/files/delete/:id', deleteFile);

module.exports = router;
