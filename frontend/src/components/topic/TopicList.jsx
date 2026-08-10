import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import TopicCard from "./TopicCard";
import TopicModal from "../../modals/TopicModal";

import {
  getTopics,
  deleteTopic,
  toggleTopic,
} from "../../services/topicService";

export default function TopicList({ subjectId }) {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    if (subjectId) {
      fetchTopics();
    }
  }, [subjectId]);

  const fetchTopics = async () => {
    try {
      setLoading(true);

      const data = await getTopics(subjectId);

      setTopics(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load topics");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this topic?")) return;

    try {
      await deleteTopic(id);

      toast.success("Topic deleted");

      fetchTopics();
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleTopic(id);

      fetchTopics();
    } catch (error) {
      console.error(error);
      toast.error("Unable to update topic");
    }
  };

  const handleEdit = (topic) => {
    setSelectedTopic(topic);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedTopic(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="mt-6 text-center font-semibold">
        Loading Topics...
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mt-8 mb-6">

        <h2 className="text-2xl font-bold">
          Topics
        </h2>

        <button
          onClick={handleAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl"
        >
          + Add Topic
        </button>

      </div>

      {topics.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-8 text-center">

          <h3 className="text-xl font-bold">
            No Topics Yet 📚
          </h3>

          <p className="text-gray-500 mt-2">
            Create your first topic.
          </p>

        </div>
      ) : (
        <div className="space-y-4">
          {topics.map((topic) => (
            <TopicCard
              key={topic._id}
              topic={topic}
              onDelete={handleDelete}
              onToggle={handleToggle}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      <TopicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchTopics}
        subjectId={subjectId}
        topic={selectedTopic}
      />
    </>
  );
}