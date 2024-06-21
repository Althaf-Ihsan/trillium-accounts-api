const express = require("express");
const {  getAllNotes, addNote, deleteNote} = require("../controller/noteController");
const router = express.Router();
//get patient notes
router.get("/account/note/list/:id",getAllNotes )

//add new patient notes
router.post("/account/note/add",addNote)

//delete patient note
router.delete("/account/note/delete/:id",deleteNote)
module.exports = router;
