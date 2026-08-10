import api from "./api";

// Get all subjects
export const getSubjects = async () => {
  const res = await api.get("/subjects");
  return res.data.subjects;
};

// Get single subject
export const getSubjectById = async (id) => {
  const res = await api.get(`/subjects/${id}`);
  return res.data.subject;
};

// Create Subject
export const createSubject = async (data) => {
  const res = await api.post("/subjects", data);
  return res.data.subject;
};

// Update Subject
export const updateSubject = async (id, data) => {
  const res = await api.put(`/subjects/${id}`, data);
  return res.data.subject;
};

// Delete Subject
export const deleteSubject = async (id) => {
  const res = await api.delete(`/subjects/${id}`);
  return res.data;
};