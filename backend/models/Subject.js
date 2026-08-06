import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    color: {
      type: String,
      default: "#3B82F6",
    },

    progress: {
      type: Number,
      default: 0,
    },

    totalTopics: {
      type: Number,
      default: 0,
    },

    completedTopics: {
      type: Number,
      default: 0,
    },

    // NEW
    visibility: {
      type: String,
      enum: ["private", "public", "group"],
      default: "private",
    },

    // NEW
    inviteCode: {
      type: String,
      default: null,
    },

    // NEW
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

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

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;