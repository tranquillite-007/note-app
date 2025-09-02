const express = require("express");
const {
  getNotes,
  createNote,
  deleteNote,
} = require("../controllers/noteController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", getNotes);

router.post("/", createNote);

router.delete("/:id", deleteNote);

module.exports = router;
