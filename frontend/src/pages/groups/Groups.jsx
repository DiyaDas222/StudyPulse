import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaCopy,
  FaExternalLinkAlt,
  FaSignOutAlt,
  FaTrash,
  FaCrown,
} from "react-icons/fa";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

import { useAuth } from "../../context/AuthContext";

import {
  getMyGroups,
  leaveGroup,
  removeMember,
} from "../../services/groupService";

export default function Groups() {
  const { user } = useAuth();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [leavingId, setLeavingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  // ==========================================
  // Fetch Groups
  // ==========================================
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);

      const data = await getMyGroups();

      setGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to load groups"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Current User ID
  // ==========================================
  const currentUserId =
    user?._id ||
    user?.id ||
    user?.userId;

  // ==========================================
  // Copy Invite Code
  // ==========================================
  const copyInviteCode = async (code) => {
    if (!code) {
      toast.error("Invite code unavailable");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);

      toast.success("Invite code copied!");
    } catch (error) {
      console.error(error);

      toast.error("Unable to copy invite code");
    }
  };

  // ==========================================
  // Copy Invite Link
  // ==========================================
  const copyInviteLink = async (code) => {
    if (!code) {
      toast.error("Invite code unavailable");
      return;
    }

    const link =
      `${window.location.origin}/explore?invite=${encodeURIComponent(
        code
      )}`;

    try {
      await navigator.clipboard.writeText(link);

      toast.success("Invite link copied!");
    } catch (error) {
      console.error(error);

      toast.error("Unable to copy invite link");
    }
  };

  // ==========================================
  // Leave Group
  // ==========================================
  const handleLeaveGroup = async (group) => {
    const confirmed = window.confirm(
      `Are you sure you want to leave "${group.name}"?`
    );

    if (!confirmed) return;

    try {
      setLeavingId(group._id);

      await leaveGroup(group._id);

      toast.success(
        "You left the group successfully"
      );

      setGroups((currentGroups) =>
        currentGroups.filter(
          (item) => item._id !== group._id
        )
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to leave group"
      );
    } finally {
      setLeavingId(null);
    }
  };

  // ==========================================
  // Remove Member
  // ==========================================
  const handleRemoveMember = async (
    group,
    member
  ) => {
    const memberName =
      member?.name ||
      member?.email ||
      "this member";

    const confirmed = window.confirm(
      `Remove ${memberName} from "${group.name}"?`
    );

    if (!confirmed) return;

    try {
      setRemovingId(member._id);

      const response = await removeMember(
        group._id,
        member._id
      );

      toast.success(
        response?.message ||
          "Member removed successfully"
      );

      // Update only the affected group
      setGroups((currentGroups) =>
        currentGroups.map((item) => {
          if (item._id !== group._id) {
            return item;
          }

          return {
            ...item,
            members: (item.members || []).filter(
              (currentMember) =>
                currentMember._id !== member._id
            ),
          };
        })
      );
    } catch (error) {
      console.error(
        "Remove member error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Unable to remove member"
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}

      <Sidebar />

      <div className="flex-1 min-w-0">

        <Navbar />

        <main className="p-8">

          {/* ==================================
              Header
          ================================== */}

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              My Groups
            </h1>

            <p className="text-gray-500 mt-2">
              Collaborate with classmates and track shared progress.
            </p>

          </div>

          {/* ==================================
              Loading
          ================================== */}

          {loading ? (

            <div className="bg-white rounded-3xl shadow-lg p-10 mt-10 text-center">

              <p className="font-semibold text-gray-600">
                Loading groups...
              </p>

            </div>

          ) : groups.length === 0 ? (

            /* ==================================
               Empty State
            ================================== */

            <div className="bg-white rounded-3xl shadow-lg p-12 mt-10 text-center">

              <div className="text-5xl">
                👥
              </div>

              <h2 className="text-3xl font-bold mt-4">
                No Groups Yet
              </h2>

              <p className="mt-3 text-gray-500">
                Create a Group subject or join one using an invite code.
              </p>

              <Link
                to="/dashboard"
                className="inline-block mt-7 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Go to Dashboard
              </Link>

            </div>

          ) : (

            /* ==================================
               Groups
            ================================== */

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">

              {groups.map((group) => {

                const members = Array.isArray(
                  group.members
                )
                  ? group.members
                  : [];

                // ------------------------------
                // Group Owner
                // ------------------------------

                const ownerId =
                  typeof group.user === "object"
                    ? group.user?._id
                    : group.user;

                const isOwner =
                  currentUserId &&
                  ownerId &&
                  currentUserId.toString() ===
                    ownerId.toString();

                return (
                  <div
                    key={group._id}
                    className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6"
                  >

                    {/* =================================
                        Header
                    ================================= */}

                    <div className="flex justify-between items-start gap-4">

                      <div className="min-w-0">

                        <h2 className="text-2xl font-bold text-slate-800 truncate">
                          {group.name}
                        </h2>

                        <p className="text-gray-500 mt-2 text-sm">
                          {group.description ||
                            "No description added."}
                        </p>

                      </div>

                      <span className="shrink-0 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Group
                      </span>

                    </div>

                    {/* Owner Badge */}

                    {isOwner && (
                      <div className="mt-4 inline-flex items-center gap-2 bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-2 rounded-xl text-sm font-semibold">
                        <FaCrown />
                        Group Owner
                      </div>
                    )}

                    {/* =================================
                        Progress
                    ================================= */}

                    <div className="mt-6">

                      <div className="flex justify-between text-sm mb-2">

                        <span className="text-gray-500">
                          Group Progress
                        </span>

                        <span className="font-bold text-indigo-600">
                          {group.progress || 0}%
                        </span>

                      </div>

                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              Math.max(
                                Number(
                                  group.progress || 0
                                ),
                                0
                              ),
                              100
                            )}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* =================================
                        Invite Code
                    ================================= */}

                    <div className="mt-6 bg-purple-50 rounded-2xl p-4">

                      <p className="text-xs uppercase tracking-wide text-purple-600 font-bold">
                        Invite Code
                      </p>

                      <div className="flex items-center justify-between gap-3 mt-2">

                        <span className="font-bold text-purple-900 tracking-wider break-all">
                          {group.inviteCode || "-"}
                        </span>

                        <button
                          onClick={() =>
                            copyInviteCode(
                              group.inviteCode
                            )
                          }
                          className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl"
                          title="Copy invite code"
                        >
                          <FaCopy />
                        </button>

                      </div>

                    </div>

                    {/* =================================
                        Members
                    ================================= */}

                    <div className="mt-6">

                      <div className="flex items-center justify-between">

                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                          <FaUsers className="text-indigo-600" />
                          Members
                        </h3>

                        <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {members.length}
                        </span>

                      </div>

                      <div className="mt-3 space-y-2 max-h-52 overflow-y-auto">

                        {members.length === 0 ? (

                          <p className="text-sm text-gray-500">
                            No member information available.
                          </p>

                        ) : (

                          members.map((member) => {

                            const memberId =
                              member?._id?.toString();

                            const isMemberOwner =
                              ownerId &&
                              memberId &&
                              ownerId.toString() ===
                                memberId;

                            const isRemoving =
                              removingId ===
                              member?._id;

                            return (
                              <div
                                key={member._id}
                                className="flex items-center justify-between gap-3 bg-slate-50 rounded-xl p-3"
                              >

                                {/* Member Info */}

                                <div className="flex items-center gap-3 min-w-0">

                                  <div className="w-9 h-9 shrink-0 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">

                                    {(
                                      member.name ||
                                      member.email ||
                                      "U"
                                    )
                                      .charAt(0)
                                      .toUpperCase()}

                                  </div>

                                  <div className="min-w-0">

                                    <p className="font-semibold text-sm truncate">
                                      {member.name ||
                                        "Unnamed User"}
                                    </p>

                                    <p className="text-xs text-gray-500 truncate">
                                      {member.email || ""}
                                    </p>

                                  </div>

                                </div>

                                {/* Owner / Remove */}

                                {isMemberOwner ? (

                                  <span className="shrink-0 flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-semibold">
                                    <FaCrown />
                                    Owner
                                  </span>

                                ) : isOwner ? (

                                  <button
                                    onClick={() =>
                                      handleRemoveMember(
                                        group,
                                        member
                                      )
                                    }
                                    disabled={isRemoving}
                                    className="shrink-0 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Remove member"
                                  >
                                    <FaTrash />

                                    {isRemoving
                                      ? "Removing..."
                                      : "Remove"}
                                  </button>

                                ) : null}

                              </div>
                            );
                          })

                        )}

                      </div>

                    </div>

                    {/* =================================
                        Share + Open
                    ================================= */}

                    <div className="grid grid-cols-2 gap-3 mt-6">

                      <button
                        onClick={() =>
                          copyInviteLink(
                            group.inviteCode
                          )
                        }
                        className="bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition"
                      >
                        🔗 Share Link
                      </button>

                      <Link
                        to={`/subject/${group._id}`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition"
                      >
                        Open
                        <FaExternalLinkAlt />
                      </Link>

                    </div>

                    {/* =================================
                        Leave Group
                    ================================= */}

                    {!isOwner && (

                      <button
                        onClick={() =>
                          handleLeaveGroup(group)
                        }
                        disabled={
                          leavingId === group._id
                        }
                        className="w-full mt-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >

                        <FaSignOutAlt />

                        {leavingId === group._id
                          ? "Leaving..."
                          : "Leave Group"}

                      </button>

                    )}

                  </div>
                );
              })}

            </div>

          )}

        </main>

      </div>

    </div>
  );
}