import express from "express";

import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Subject
router.post("/", authMiddleware, createSubject);

// Get All Subjects
router.get("/", authMiddleware, getSubjects);

// Get Single Subject
router.get("/:id", authMiddleware, getSubjectById);

// Update Subject
router.put("/:id", authMiddleware, updateSubject);

// Delete Subject
router.delete("/:id", authMiddleware, deleteSubject);

export default router;