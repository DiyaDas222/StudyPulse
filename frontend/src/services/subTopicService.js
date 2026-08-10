import api from "./api";

// Get all subtopics of a topic
export const getSubTopics = async (topicId) => {
  const res = await api.get(`/subtopics/${topicId}`);
  return res.data.subTopics;
};

// Create
export const createSubTopic = async (data) => {
  const res = await api.post("/subtopics", data);
  return res.data.subTopic;
};

// Update
export const updateSubTopic = async (id, data) => {
  const res = await api.put(`/subtopics/${id}`, data);
  return res.data.subTopic;
};

// Delete
export const deleteSubTopic = async (id) => {
  const res = await api.delete(`/subtopics/${id}`);
  return res.data;
};

// Change Status
export const changeSubTopicStatus = async (id, status) => {
  const res = await api.patch(`/subtopics/${id}/status`, {
    status,
  });

  return res.data.subTopic;
};