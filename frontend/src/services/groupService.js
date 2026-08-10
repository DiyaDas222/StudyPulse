import api from "./api";

export const getMyGroups = async () => {
  const res = await api.get("/subjects");
  return (res.data.subjects || []).filter(
    (subject) => subject.visibility === "group"
  );
};

export const joinGroup = async (inviteCode) => {
  const res = await api.post("/subjects/join", {
    inviteCode,
  });

  return res.data;
};