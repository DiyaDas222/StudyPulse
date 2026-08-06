import Subject from "../models/Subject.js";

// =============================
// Create Subject
// =============================
export const createSubject = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required",
      });
    }

    const subject = await Subject.create({
      name,
      description,
      color,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get All Subjects
// =============================
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Get Single Subject
// =============================
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.status(200).json({
      success: true,
      subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Update Subject
// =============================
export const updateSubject = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    subject.name = name || subject.name;
    subject.description = description ?? subject.description;
    subject.color = color || subject.color;

    await subject.save();

    res.status(200).json({
      success: true,
      message: "Subject updated successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =============================
// Delete Subject
// =============================
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    await subject.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};