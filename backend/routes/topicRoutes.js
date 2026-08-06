import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createTopic,
  getTopics,
  updateTopic,
  deleteTopic,
  toggleTopic,
} from "../controllers/topicController.js";

const router = express.Router();

router.post("/", authMiddleware, createTopic);

router.get("/:subjectId", authMiddleware, getTopics);

router.put("/:id", authMiddleware, updateTopic);

router.delete("/:id", authMiddleware, deleteTopic);

router.patch("/:id/toggle", authMiddleware, toggleTopic);

export default router;