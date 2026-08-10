import api from "./api";

// Get all public subjects
export const getPublicSubjects = async () => {
  const res = await api.get("/subjects/public");
  return res.data.subjects;
};

// Join group using invite code
export const joinGroup = async (inviteCode) => {
  const res = await api.post("/subjects/join", {
    inviteCode,
  });

  return res.data;
};