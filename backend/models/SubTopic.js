import mongoose from "mongoose";

const subTopicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Subtopic title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["not_started", "in_progress", "done"],
      default: "not_started",
    },

    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubTopic = mongoose.model("SubTopic", subTopicSchema);

export default SubTopic;