import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";

import {
  createSubject,
  updateSubject,
} from "../services/subjectService";

export default function SubjectModal({
  isOpen,
  onClose,
  onSuccess,
  subject,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#6366F1",
    visibility: "private",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subject) {
      setForm({
        name: subject.name || "",
        description: subject.description || "",
        color: subject.color || "#6366F1",
        visibility: subject.visibility || "private",
      });
    } else {
      setForm({
        name: "",
        description: "",
        color: "#6366F1",
        visibility: "private",
      });
    }
  }, [subject, isOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Subject name is required");
      return;
    }

    try {
      setLoading(true);

      if (subject) {
        await updateSubject(subject._id, form);
        toast.success("Subject updated successfully");
      } else {
        await createSubject(form);
        toast.success("Subject created successfully");
      }

      onSuccess();
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Something went wrong"
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
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            transition={{
              duration: 0.25,
            }}
            className="fixed inset-0 flex items-center justify-center z-50 p-5"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b">

                <h2 className="text-2xl font-bold">
                  {subject ? "Edit Subject" : "Add Subject"}
                </h2>

                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <FaTimes size={20} />
                </button>

              </div>

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5"
              >

                <div>

                  <label className="block mb-2 font-medium">
                    Subject Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter subject name"
                    className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                </div>

                <div>

                  <label className="block mb-2 font-medium">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Write a short description..."
                    className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                </div>

                <div>

                  <label className="block mb-2 font-medium">
                    Subject Color
                  </label>

                  <input
                    type="color"
                    name="color"
                    value={form.color}
                    onChange={handleChange}
                    className="w-24 h-12 cursor-pointer rounded-lg"
                  />

                </div>

                <div>

                  <label className="block mb-2 font-medium">
                    Visibility
                  </label>

                  <select
                    name="visibility"
                    value={form.visibility}
                    onChange={handleChange}
                    className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="private">
                      🔒 Private
                    </option>

                    <option value="public">
                      🌍 Public
                    </option>

                    <option value="group">
                      👥 Group
                    </option>

                  </select>

                  <p className="text-sm text-gray-500 mt-2">
                    Private: Only you can access it.
                    <br />
                    Public: Everyone can explore it.
                    <br />
                    Group: Share it using an invite code.
                  </p>

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
                >
                  {loading
                    ? "Saving..."
                    : subject
                    ? "Update Subject"
                    : "Create Subject"}
                </button>

              </form>

            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}