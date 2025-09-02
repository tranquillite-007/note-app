const Note = require("../models/Note");

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching notes",
    });
  }
};

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be more than 100 characters",
      });
    }

    if (content.length > 10000) {
      return res.status(400).json({
        success: false,
        message: "Content cannot be more than 10000 characters",
      });
    }

    // Create note
    const note = await Note.create({
      title,
      content,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: {
        id: note._id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating note",
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this note",
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while deleting note",
    });
  }
};

module.exports = {
  getNotes,
  createNote,
  deleteNote,
};
