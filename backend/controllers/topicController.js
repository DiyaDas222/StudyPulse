import updateProgress from "../utils/updateProgress.js";
import Topic from "../models/Topic.js";

// Create Topic
export const createTopic = async (req, res) => {
  try {
    const { title, description, subject } = req.body;

    if (!title || !subject) {
      return res.status(400).json({
        success: false,
        message: "Title and Subject are required",
      });
    }

    const topic = await Topic.create({
      title,
      description,
      subject,
      user: req.user.id,
    });
    await updateProgress(subject);

    res.status(201).json({
      success: true,
      message: "Topic created successfully",
      topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Topics of a Subject
export const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find({
      subject: req.params.subjectId,
      user: req.user.id,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: topics.length,
      topics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Topic
export const updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    topic.title = req.body.title || topic.title;
    topic.description = req.body.description ?? topic.description;

    await topic.save();

    res.status(200).json({
      success: true,
      message: "Topic updated successfully",
      topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Topic
export const deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    await topic.deleteOne();
    await updateProgress(topic.subject);

    res.status(200).json({
      success: true,
      message: "Topic deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle Topic Completion
export const toggleTopic = async (req, res) => {
  try {
    const topic = await Topic.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic not found",
      });
    }

    topic.completed = !topic.completed;

    await topic.save();
    await updateProgress(topic.subject);

    res.status(200).json({
      success: true,
      message: "Topic status updated",
      topic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};