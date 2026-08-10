import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUsers,
  FaCopy,
  FaExternalLinkAlt,
} from "react-icons/fa";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

import { getMyGroups } from "../../services/groupService";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

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
      toast.error("Unable to load groups");
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = async (code) => {
    if (!code) {
      toast.error("Invite code unavailable");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      toast.success("Invite code copied!");
    } catch (error) {
      toast.error("Unable to copy invite code");
    }
  };

  const copyInviteLink = async (code) => {
    if (!code) {
      toast.error("Invite code unavailable");
      return;
    }

    const link =
      `${window.location.origin}/groups?invite=${encodeURIComponent(code)}`;

    try {
      await navigator.clipboard.writeText(link);
      toast.success("Invite link copied!");
    } catch (error) {
      toast.error("Unable to copy invite link");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1 min-w-0">

        <Navbar />

        <main className="p-8">

          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              My Groups
            </h1>

            <p className="text-gray-500 mt-2">
              Collaborate with classmates and track shared progress.
            </p>
          </div>

          {loading ? (

            <div className="bg-white rounded-3xl shadow-lg p-10 mt-10 text-center">
              <p className="font-semibold text-gray-600">
                Loading groups...
              </p>
            </div>

          ) : groups.length === 0 ? (

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

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">

              {groups.map((group) => {

                const members = Array.isArray(group.members)
                  ? group.members
                  : [];

                return (
                  <div
                    key={group._id}
                    className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6"
                  >

                    {/* Header */}

                    <div className="flex justify-between items-start gap-4">

                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">
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

                    {/* Progress */}

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
                                Number(group.progress || 0),
                                0
                              ),
                              100
                            )}%`,
                          }}
                        />

                      </div>

                    </div>

                    {/* Invite */}

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
                            copyInviteCode(group.inviteCode)
                          }
                          className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-xl"
                          title="Copy invite code"
                        >
                          <FaCopy />
                        </button>

                      </div>

                    </div>

                    {/* Members */}

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

                      <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">

                        {members.length === 0 ? (

                          <p className="text-sm text-gray-500">
                            No member information available.
                          </p>

                        ) : (

                          members.map((member) => (

                            <div
                              key={member._id}
                              className="flex items-center gap-3 bg-slate-50 rounded-xl p-3"
                            >

                              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
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

                          ))

                        )}

                      </div>

                    </div>

                    {/* Actions */}

                    <div className="grid grid-cols-2 gap-3 mt-6">

                      <button
                        onClick={() =>
                          copyInviteLink(group.inviteCode)
                        }
                        className="bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold text-sm"
                      >
                        🔗 Share Link
                      </button>

                      <Link
                        to={`/subject/${group._id}`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                      >
                        Open
                        <FaExternalLinkAlt />
                      </Link>

                    </div>

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