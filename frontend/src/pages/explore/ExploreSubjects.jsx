import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getPublicSubjects,
  joinGroup,
} from "../../services/exploreService";

export default function ExploreSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const [searchParams, setSearchParams] =
    useSearchParams();

  // ==========================================
  // Load public subjects + invite code
  // ==========================================
  useEffect(() => {
    fetchSubjects();

    const code = searchParams.get("invite");

    if (code) {
      setInviteCode(code);
    }
  }, [searchParams]);

  // ==========================================
  // Fetch Public Subjects
  // ==========================================
  const fetchSubjects = async () => {
    try {
      setLoading(true);

      const data = await getPublicSubjects();

      setSubjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to load public subjects"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Join Group
  // ==========================================
  const handleJoin = async () => {
    const code = inviteCode.trim();

    if (!code) {
      toast.error("Enter an invite code");
      return;
    }

    try {
      setJoining(true);

      await joinGroup(code);

      toast.success("Joined group successfully!");

      // Clear invite code
      setInviteCode("");

      // Remove ?invite=... from URL
      setSearchParams({});
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to join group"
      );
    } finally {
      setJoining(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg px-8 py-6">
          <p className="text-lg font-semibold text-gray-700">
            Loading subjects...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-100 p-8">

      {/* Header */}

      <div className="max-w-7xl mx-auto">

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-slate-800">
            Explore Subjects
          </h1>

          <p className="text-gray-500 mt-2">
            Discover public subjects and join study groups.
          </p>

        </div>

        {/* ======================================
            Join Group
        ====================================== */}

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

          <div className="flex items-center gap-3 mb-4">

            <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center text-xl">
              👥
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Join Group
              </h2>

              <p className="text-sm text-gray-500">
                Enter an invite code to join a study group.
              </p>
            </div>

          </div>

          <div className="flex flex-col md:flex-row gap-3">

            <input
              type="text"
              value={inviteCode}
              onChange={(e) =>
                setInviteCode(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleJoin();
                }
              }}
              placeholder="Enter Invite Code"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />

            <button
              onClick={handleJoin}
              disabled={joining}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              {joining ? "Joining..." : "Join"}
            </button>

          </div>

          {/* Link detected message */}

          {searchParams.get("invite") && (
            <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl p-3">

              <p className="text-sm text-indigo-700 font-medium">
                🔗 Invite link detected. The invite code has been filled automatically.
              </p>

            </div>
          )}

        </div>

        {/* ======================================
            Public Subjects
        ====================================== */}

        {subjects.length === 0 ? (

          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

            <div className="text-5xl mb-4">
              🌍
            </div>

            <h2 className="text-2xl font-bold text-slate-800">
              No Public Subjects
            </h2>

            <p className="text-gray-500 mt-2">
              There are no public subjects available right now.
            </p>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {subjects.map((subject) => (

              <div
                key={subject._id}
                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
              >

                {/* Subject color */}

                <div
                  className="h-3"
                  style={{
                    background:
                      subject.color || "#6366F1",
                  }}
                />

                <div className="p-6">

                  {/* Subject name */}

                  <h2 className="text-2xl font-bold text-slate-800">
                    {subject.name}
                  </h2>

                  {/* Description */}

                  <p className="text-gray-500 mt-2 min-h-[48px]">
                    {subject.description ||
                      "No description added."}
                  </p>

                  {/* Progress */}

                  <div className="mt-6">

                    <div className="flex justify-between text-sm mb-2">

                      <span className="text-gray-500">
                        Progress
                      </span>

                      <span className="font-bold text-indigo-600">
                        {subject.progress || 0}%
                      </span>

                    </div>

                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            Math.max(
                              Number(
                                subject.progress || 0
                              ),
                              0
                            ),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Creator */}

                  {subject.user?.name && (
                    <p className="text-sm text-gray-500 mt-5">
                      Created by{" "}
                      <span className="font-semibold text-gray-700">
                        {subject.user.name}
                      </span>
                    </p>
                  )}

                  {/* View */}

                  <button
                    className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
                    onClick={() => {
                      toast(
                        "Public subject viewing will be available soon."
                      );
                    }}
                  >
                    View Subject
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}