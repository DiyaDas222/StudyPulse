import express from "express";

import {
  createSubject,
  getSubjects,
  getPublicSubjects,
  joinGroup,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================
// Subject CRUD
// ==========================

router.post("/", authMiddleware, createSubject);

router.get("/", authMiddleware, getSubjects);

router.get("/public", authMiddleware, getPublicSubjects);

router.post("/join", authMiddleware, joinGroup);

router.get("/:id", authMiddleware, getSubjectById);

router.put("/:id", authMiddleware, updateSubject);

router.delete("/:id", authMiddleware, deleteSubject);

export default router;