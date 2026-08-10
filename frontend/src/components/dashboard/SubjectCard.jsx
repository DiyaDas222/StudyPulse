import { motion } from "framer-motion";
import {
  FaEdit,
  FaTrash,
  FaArrowRight,
  FaUsers,
  FaCopy,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProgressBar from "../common/ProgressBar";

export default function SubjectCard({
  subject,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  const isGroup = subject.visibility === "group";

  const handleCopyInviteCode = async () => {
    if (!subject.inviteCode) {
      toast.error("Invite code not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(
        subject.inviteCode
      );

      toast.success("Invite code copied!");
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy invite code");
    }
  };

  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
    >
      {/* Color */}

      <div
        className="h-3 w-full"
        style={{
          background: subject.color || "#6366F1",
        }}
      />

      <div className="p-6">

        {/* Header */}

        <div className="flex justify-between items-start gap-4">

          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-2">

              <h2 className="text-xl font-bold text-slate-800 truncate">
                {subject.name}
              </h2>

            </div>

            {/* Visibility */}

            <div className="mt-2">

              {subject.visibility === "group" && (
                <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <FaUsers />
                  Group
                </span>
              )}

              {subject.visibility === "public" && (
                <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  🌍 Public
                </span>
              )}

              {subject.visibility === "private" && (
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                  🔒 Private
                </span>
              )}

            </div>

            <p className="text-gray-500 mt-3 text-sm">
              {subject.description ||
                "No description added."}
            </p>

          </div>

          {/* Actions */}

          <div className="flex gap-2 shrink-0">

            <button
              onClick={() => onEdit(subject)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-xl transition"
              title="Edit Subject"
            >
              <FaEdit />
            </button>

            <button
              onClick={() => onDelete(subject._id)}
              className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition"
              title="Delete Subject"
            >
              <FaTrash />
            </button>

          </div>

        </div>

        {/* Group Invite Code */}

        {isGroup && subject.inviteCode && (
          <div className="mt-5 bg-purple-50 border border-purple-100 rounded-2xl p-4">

            <div className="flex justify-between items-center gap-3">

              <div>
                <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide">
                  Invite Code
                </p>

                <p className="text-lg font-bold text-purple-900 tracking-wider mt-1">
                  {subject.inviteCode}
                </p>
              </div>

              <button
                onClick={handleCopyInviteCode}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl text-sm font-semibold transition"
                title="Copy invite code"
              >
                <FaCopy />
                Copy
              </button>

            </div>

          </div>
        )}

        {/* Progress */}

        <div className="mt-6">
          <ProgressBar
            progress={subject.progress || 0}
          />
        </div>

        {/* Stats */}

        <div className="flex justify-between items-center mt-5">

          <div>

            <p className="text-sm text-gray-500">
              Topics
            </p>

            <p className="font-semibold">
              {subject.completedTopics || 0} /{" "}
              {subject.totalTopics || 0}
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

        {/* Open */}

        <button
          onClick={() =>
            navigate(`/subject/${subject._id}`)
          }
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition"
        >
          Open Subject
          <FaArrowRight />
        </button>

      </div>

    </motion.div>
  );
}