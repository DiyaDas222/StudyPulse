import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../common/ProgressBar";

export default function SubjectCard({
  subject,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div
        className="h-3 w-full"
        style={{
          background: subject.color || "#6366F1",
        }}
      />

      <div className="p-6">

        <div className="flex justify-between items-start">

          <div className="flex-1">

            <h2 className="text-xl font-bold text-slate-800">
              {subject.name}
            </h2>

            <p className="text-gray-500 mt-2 text-sm">
              {subject.description || "No description added."}
            </p>

          </div>

          <div className="flex gap-2">

            <button
              onClick={() => onEdit(subject)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-xl transition"
            >
              <FaEdit />
            </button>

            <button
              onClick={() => onDelete(subject._id)}
              className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition"
            >
              <FaTrash />
            </button>

          </div>

        </div>

        <div className="mt-6">
          <ProgressBar progress={subject.progress || 0} />
        </div>

        <div className="flex justify-between items-center mt-5">

          <div>
            <p className="text-sm text-gray-500">
              Topics
            </p>

            <p className="font-semibold">
              {subject.completedTopics || 0} / {subject.totalTopics || 0}
            </p>
          </div>

          <div className="text-right">

            <p className="text-sm text-gray-500">
              Progress
            </p>

            <p className="font-bold text-indigo-600">
              {subject.progress || 0}%
            </p>

          </div>

        </div>

        <button
          onClick={() => navigate(`/subject/${subject._id}`)}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition"
        >
          Open Subject
          <FaArrowRight />
        </button>

      </div>

    </motion.div>
  );
}