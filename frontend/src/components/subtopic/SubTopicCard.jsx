import { FaCheckCircle, FaCircle, FaEdit, FaTrash } from "react-icons/fa";

export default function SubTopicCard({
  subTopic,
  onStatus,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-gray-50 rounded-xl border p-4 flex justify-between items-center">

      <div className="flex items-center gap-3">

        <button
          onClick={() => onStatus(subTopic)}
          className="text-lg"
        >
          {subTopic.status === "done" ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaCircle className="text-gray-400" />
          )}
        </button>

        <div>

          <h3
            className={`font-semibold ${
              subTopic.status === "done"
                ? "line-through text-gray-400"
                : ""
            }`}
          >
            {subTopic.title}
          </h3>

          <p className="text-sm text-gray-500">
            {subTopic.description}
          </p>

        </div>

      </div>

      <div className="flex gap-2">

        <button
          onClick={() => onEdit(subTopic)}
          className="bg-blue-100 text-blue-600 p-2 rounded-lg"
        >
          <FaEdit />
        </button>

        <button
          onClick={() => onDelete(subTopic._id)}
          className="bg-red-100 text-red-600 p-2 rounded-lg"
        >
          <FaTrash />
        </button>

      </div>

    </div>
  );
}