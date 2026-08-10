import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  createSubTopic,
  updateSubTopic,
} from "../services/subTopicService";

export default function SubTopicModal({
  open,
  onClose,
  onSuccess,
  topicId,
  subjectId,
  subTopic,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (subTopic) {
      setTitle(subTopic.title);
      setDescription(subTopic.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [subTopic]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return toast.error("Title is required");
    }

    try {
      if (subTopic) {
        await updateSubTopic(subTopic._id, {
          title,
          description,
        });

        toast.success("SubTopic updated");
      } else {
        await createSubTopic({
          title,
          description,
          topic: topicId,
          subject: subjectId,
        });

        toast.success("SubTopic created");
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl w-full max-w-md p-6">

        <h2 className="text-2xl font-bold mb-5">
          {subTopic ? "Edit SubTopic" : "Add SubTopic"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            className="w-full border rounded-xl p-3"
            placeholder="SubTopic Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full border rounded-xl p-3"
            rows="4"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="border px-5 py-2 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl"
            >
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}