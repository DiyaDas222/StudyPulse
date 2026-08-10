import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaRegCircle,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

export default function TopicCard({
  topic,
  onToggle,
  onDelete,
  onEdit,
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-2xl shadow-md border p-5"
    >
      <div className="flex justify-between items-start">

        <div className="flex gap-3">

          <button
            onClick={() => onToggle(topic._id)}
            className="mt-1"
          >
            {topic.completed ? (
              <FaCheckCircle
                className="text-green-500"
                size={22}
              />
            ) : (
              <FaRegCircle
                className="text-gray-400"
                size={22}
              />
            )}
          </button>

          <div>

            <h2
              className={`text-lg font-bold ${
                topic.completed
                  ? "line-through text-gray-400"
                  : "text-slate-800"
              }`}
            >
              {topic.title}
            </h2>

            <p className="text-gray-500 mt-1">
              {topic.description || "No description"}
            </p>

          </div>

        </div>

        <div className="flex gap-2">

          <button
            onClick={() => onEdit(topic)}
            className="bg-blue-50 text-blue-600 p-2 rounded-lg"
          >
            <FaEdit />
          </button>

          <button
            onClick={() => onDelete(topic._id)}
            className="bg-red-50 text-red-600 p-2 rounded-lg"
          >
            <FaTrash />
          </button>

        </div>

      </div>

      <div className="mt-4">

        {topic.completed ? (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
            Done
          </span>
        ) : (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
            In Progress
          </span>
        )}

      </div>

    </motion.div>
  );
}