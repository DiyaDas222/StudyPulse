import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  createSubTopic,
  getSubTopics,
  updateSubTopic,
  deleteSubTopic,
  changeSubTopicStatus,
} from "../controllers/subTopicController.js";

const router = express.Router();

// Create
router.post("/", authMiddleware, createSubTopic);

// Get all subtopics of a topic
router.get("/:topicId", authMiddleware, getSubTopics);

// Update
router.put("/:id", authMiddleware, updateSubTopic);

// Delete
router.delete("/:id", authMiddleware, deleteSubTopic);

// Change Status
router.patch("/:id/status", authMiddleware, changeSubTopicStatus);

export default router;