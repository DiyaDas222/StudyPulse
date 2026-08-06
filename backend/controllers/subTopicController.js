import SubTopic from "../models/SubTopic.js";

// ============================
// Create SubTopic
// ============================
export const createSubTopic = async (req, res) => {
  try {
    const { title, description, topic, subject } = req.body;

    if (!title || !topic || !subject) {
      return res.status(400).json({
        success: false,
        message: "Title, Topic and Subject are required",
      });
    }

    const subTopic = await SubTopic.create({
      title,
      description,
      topic,
      subject,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "SubTopic created successfully",
      subTopic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Get SubTopics
// ============================
export const getSubTopics = async (req, res) => {
  try {
    const subTopics = await SubTopic.find({
      topic: req.params.topicId,
      user: req.user.id,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: subTopics.length,
      subTopics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Update SubTopic
// ============================
export const updateSubTopic = async (req, res) => {
  try {
    const subTopic = await SubTopic.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!subTopic) {
      return res.status(404).json({
        success: false,
        message: "SubTopic not found",
      });
    }

    subTopic.title = req.body.title || subTopic.title;
    subTopic.description =
      req.body.description ?? subTopic.description;

    await subTopic.save();

    res.status(200).json({
      success: true,
      message: "SubTopic updated",
      subTopic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Delete SubTopic
// ============================
export const deleteSubTopic = async (req, res) => {
  try {
    const subTopic = await SubTopic.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!subTopic) {
      return res.status(404).json({
        success: false,
        message: "SubTopic not found",
      });
    }

    await subTopic.deleteOne();

    res.status(200).json({
      success: true,
      message: "SubTopic deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================
// Change Status
// ============================
export const changeSubTopicStatus = async (req, res) => {
  try {
    const subTopic = await SubTopic.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!subTopic) {
      return res.status(404).json({
        success: false,
        message: "SubTopic not found",
      });
    }

    subTopic.status = req.body.status;

    await subTopic.save();

    res.status(200).json({
      success: true,
      message: "Status updated",
      subTopic,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};