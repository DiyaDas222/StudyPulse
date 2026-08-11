import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaRegCircle,
  FaClock,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

export default function TopicCard({
  topic,
  onToggle,
  onDelete,
  onEdit,
}) {
  // ==========================================
  // Current Status
  // ==========================================
  const status = topic.status || "not_started";

  const isDone = status === "done";
  const isInProgress = status === "in_progress";

  // ==========================================
  // Status UI
  // ==========================================
  const getStatus = () => {
    if (isDone) {
      return {
        text: "Done",
        className:
          "bg-green-100 text-green-700",
      };
    }

    if (isInProgress) {
      return {
        text: "In Progress",
        className:
          "bg-yellow-100 text-yellow-700",
      };
    }

    return {
      text: "Not Started",
      className:
        "bg-gray-100 text-gray-600",
    };
  };

  const currentStatus = getStatus();

  // ==========================================
  // Status Icon
  // ==========================================
  const renderStatusIcon = () => {
    if (isDone) {
      return (
        <FaCheckCircle
          className="text-green-500"
          size={22}
        />
      );
    }

    if (isInProgress) {
      return (
        <FaClock
          className="text-yellow-500"
          size={22}
        />
      );
    }

    return (
      <FaRegCircle
        className="text-gray-400"
        size={22}
      />
    );
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-2xl shadow-md border p-5"
    >

      {/* ======================================
          Main Content
      ====================================== */}

      <div className="flex justify-between items-start">

        {/* Topic */}

        <div className="flex gap-3 min-w-0">

          {/* Status Button */}

          <button
            onClick={() => onToggle(topic._id)}
            className="mt-1 shrink-0 hover:scale-110 transition"
            title="Change topic status"
          >
            {renderStatusIcon()}
          </button>

          {/* Text */}

          <div className="min-w-0">

            <h2
              className={`text-lg font-bold ${
                isDone
                  ? "line-through text-gray-400"
                  : "text-slate-800"
              }`}
            >
              {topic.title}
            </h2>

            <p className="text-gray-500 mt-1">
              {topic.description ||
                "No description"}
            </p>

          </div>

        </div>

        {/* ==================================
            Actions
        ================================== */}

        <div className="flex gap-2 shrink-0">

          <button
            onClick={() => onEdit(topic)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition"
            title="Edit topic"
          >
            <FaEdit />
          </button>

          <button
            onClick={() => onDelete(topic._id)}
            className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition"
            title="Delete topic"
          >
            <FaTrash />
          </button>

        </div>

      </div>

      {/* ======================================
          Status Badge
      ====================================== */}

      <div className="mt-4">

        <span
          className={`${currentStatus.className} px-3 py-1 rounded-full text-sm font-semibold`}
        >
          {currentStatus.text}
        </span>

      </div>

    </motion.div>
  );
}