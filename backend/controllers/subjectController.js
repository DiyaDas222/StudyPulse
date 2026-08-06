import Subject from "../models/Subject.js";
import crypto from "crypto";

// =============================
// Create Subject
// =============================
export const createSubject = async (req, res) => {
  try {
    const {
      name,
      description,
      color,
      visibility,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Subject name is required",
      });
    }

    let inviteCode = null;

    if (visibility === "group") {
      inviteCode = crypto.randomBytes(4).toString("hex");
    }

    const subject = await Subject.create({
      name,
      description,
      color,
      visibility: visibility || "private",
      inviteCode,
      members: [req.user.id],
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
// Get My Subjects
// =============================
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({
      members: req.user.id,
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
// Explore Public Subjects
// =============================
export const getPublicSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({
      visibility: "public",
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
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
// Join Group
// =============================
export const joinGroup = async (req, res) => {
  try {
    const { inviteCode } = req.body;

    const subject = await Subject.findOne({
      inviteCode,
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Invalid invite code",
      });
    }

    if (!subject.members.includes(req.user.id)) {
      subject.members.push(req.user.id);
      await subject.save();
    }

    res.status(200).json({
      success: true,
      message: "Joined successfully",
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
// Get Single Subject
// =============================
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

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
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    subject.name = req.body.name || subject.name;
    subject.description =
      req.body.description ?? subject.description;
    subject.color = req.body.color || subject.color;
    subject.visibility =
      req.body.visibility || subject.visibility;

    await subject.save();

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
// Delete Subject
// =============================
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    await subject.deleteOne();

    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};