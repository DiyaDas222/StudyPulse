import api from "./api";

// ==========================================
// Get My Groups
// ==========================================
export const getMyGroups = async () => {
  const res = await api.get("/subjects");

  return (res.data.subjects || []).filter(
    (subject) => subject.visibility === "group"
  );
};

// ==========================================
// Join Group
// ==========================================
export const joinGroup = async (inviteCode) => {
  const res = await api.post("/subjects/join", {
    inviteCode,
  });

  return res.data;
};

// ==========================================
// Leave Group
// ==========================================
export const leaveGroup = async (subjectId) => {
  const res = await api.delete(
    `/subjects/${subjectId}/leave`
  );

  return res.data;
};

// ==========================================
// Remove Member
// ==========================================
export const removeMember = async (
  subjectId,
  memberId
) => {
  const res = await api.delete(
    `/subjects/${subjectId}/members/${memberId}`
  );

  return res.data;
};