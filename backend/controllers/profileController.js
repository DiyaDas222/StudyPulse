import User from "../models/User.js";
import Subject from "../models/Subject.js";
import Topic from "../models/Topic.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const subjects = await Subject.countDocuments({
      members: req.user.id,
    });

    const topics = await Topic.countDocuments({
      user: req.user.id,
    });

    const completedTopics = await Topic.countDocuments({
      user: req.user.id,
      status: "done",
    });

    const progress =
      topics === 0
        ? 0
        : Math.round((completedTopics / topics) * 100);

    res.status(200).json({
      success: true,
      profile: {
        user,
        totalSubjects: subjects,
        totalTopics: topics,
        completedTopics,
        progress,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};