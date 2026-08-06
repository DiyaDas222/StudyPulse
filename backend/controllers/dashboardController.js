import Subject from "../models/Subject.js";

export const getDashboard = async (req, res) => {
  try {
    const subjects = await Subject.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    const totalSubjects = subjects.length;

    const totalTopics = subjects.reduce(
      (sum, subject) => sum + subject.totalTopics,
      0
    );

    const completedTopics = subjects.reduce(
      (sum, subject) => sum + subject.completedTopics,
      0
    );

    const averageProgress =
      totalSubjects === 0
        ? 0
        : Math.round(
            subjects.reduce((sum, subject) => sum + subject.progress, 0) /
              totalSubjects
          );

    res.status(200).json({
      success: true,
      dashboard: {
        totalSubjects,
        totalTopics,
        completedTopics,
        averageProgress,
        subjects,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};