import Subject from "../models/Subject.js";
import Topic from "../models/Topic.js";

const updateProgress = async (subjectId) => {

    const totalTopics = await Topic.countDocuments({
        subject: subjectId
    });

    const completedTopics = await Topic.countDocuments({
        subject: subjectId,
        completed: true
    });

    let progress = 0;

    if(totalTopics>0){
        progress=Math.round((completedTopics/totalTopics)*100);
    }

    await Subject.findByIdAndUpdate(subjectId,{
        totalTopics,
        completedTopics,
        progress
    });

}

export default updateProgress;