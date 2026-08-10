import api from "./api";

// Get all topics of a subject
export const getTopics = async (subjectId) => {
  const res = await api.get(`/topics/${subjectId}`);
  return res.data.topics;
};

// Create Topic
export const createTopic = async (data) => {
  const res = await api.post("/topics", data);
  return res.data.topic;
};

// Update Topic
export const updateTopic = async (id, data) => {
  const res = await api.put(`/topics/${id}`, data);
  return res.data.topic;
};

// Delete Topic
export const deleteTopic = async (id) => {
  const res = await api.delete(`/topics/${id}`);
  return res.data;
};

// Toggle Completion
export const toggleTopic = async (id) => {
  const res = await api.patch(`/topics/${id}/toggle`);
  return res.data.topic;
};