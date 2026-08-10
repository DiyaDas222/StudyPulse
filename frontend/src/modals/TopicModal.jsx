import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

import {
  createTopic,
  updateTopic,
} from "../services/topicService";

export default function TopicModal({
  isOpen,
  onClose,
  onSuccess,
  subjectId,
  topic,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (topic) {
      setTitle(topic.title);
      setDescription(topic.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [topic]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Topic title is required");
      return;
    }

    try {
      setLoading(true);

      if (topic) {
        await updateTopic(topic._id, {
          title,
          description,
        });

        toast.success("Topic updated");
      } else {
        await createTopic({
          title,
          description,
          subject: subjectId,
        });

        toast.success("Topic created");
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 flex justify-center items-center z-50 p-4"
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
            }}
          >
            <div
              className="bg-white rounded-3xl shadow-xl w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b">

                <h2 className="text-2xl font-bold">
                  {topic
                    ? "Edit Topic"
                    : "Add Topic"}
                </h2>

                <button onClick={onClose}>
                  <FaTimes />
                </button>

              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5"
              >
                <div>

                  <label className="font-medium">
                    Topic Name
                  </label>

                  <input
                    className="w-full border rounded-xl p-3 mt-2"
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                  />

                </div>

                <div>

                  <label className="font-medium">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    className="w-full border rounded-xl p-3 mt-2"
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                  />

                </div>

                <button
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700"
                >
                  {loading
                    ? "Saving..."
                    : topic
                    ? "Update Topic"
                    : "Create Topic"}
                </button>

              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}