import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getPublicSubjects,
  joinGroup,
} from "../../services/exploreService";

export default function ExploreSubjects() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [joinedGroup, setJoinedGroup] = useState(null);

  // ==========================================
  // Load subjects + invite code
  // ==========================================
  useEffect(() => {
    fetchSubjects();

    const params = new URLSearchParams(
      window.location.search
    );

    const code = params.get("invite");

    if (code) {
      setInviteCode(code);
    }
  }, []);

  // ==========================================
  // Fetch Public Subjects
  // ==========================================
  const fetchSubjects = async () => {
    try {
      setLoading(true);

      const data = await getPublicSubjects();

      setSubjects(
        Array.isArray(data) ? data : []
      );
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

      const response = await joinGroup(code);

      /*
        Backend returns:
        {
          success: true,
          message: "...",
          subject: {...}
        }
      */

      const joinedSubject = response?.subject;

      setJoinedGroup(joinedSubject || null);

      setShowSuccess(true);

      // Clear invite code
      setInviteCode("");

      // Remove ?invite=... from URL
      window.history.replaceState(
        {},
        "",
        "/explore"
      );

      // Refresh public subjects
      await fetchSubjects();

    } catch (error) {
      console.error("Join group error:", error);

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

        <div className="bg-white rounded-3xl shadow-lg p-10">

          <p className="text-lg font-semibold text-gray-600">
            Loading subjects...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-7xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-slate-800">
            Explore Subjects
          </h1>

          <p className="text-gray-500 mt-2">
            Discover public subjects and join study groups.
          </p>

        </div>

        {/* ======================================
            JOIN GROUP
        ====================================== */}

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
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
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              onClick={handleJoin}
              disabled={joining}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition"
            >
              {joining ? "Joining..." : "Join"}
            </button>

          </div>

          {/* Invite detected */}

          {inviteCode && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">

              <p className="text-sm text-green-700 font-semibold">
                ✅ Invite code detected
              </p>

              <p className="text-sm text-green-600 mt-1">
                Code: {inviteCode}
              </p>

            </div>
          )}

        </div>

        {/* ======================================
            PUBLIC SUBJECTS
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

                {/* Color */}

                <div
                  className="h-3"
                  style={{
                    background:
                      subject.color || "#6366F1",
                  }}
                />

                <div className="p-6">

                  <h2 className="text-2xl font-bold text-slate-800">
                    {subject.name}
                  </h2>

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
                        className="h-full bg-indigo-600 rounded-full"
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
                    onClick={() =>
                      toast(
                        "Public subject viewing will be available soon."
                      )
                    }
                    className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    View Subject
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ========================================
          SUCCESS MODAL
      ======================================== */}

      {showSuccess && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">

          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 text-center">

            {/* Success Icon */}

            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">

              <span className="text-4xl">
                🎉
              </span>

            </div>

            {/* Heading */}

            <h2 className="text-3xl font-bold text-slate-800 mt-6">
              Group Joined Successfully!
            </h2>

            {/* Message */}

            <p className="text-gray-500 mt-3 leading-relaxed">

              You have successfully joined{" "}

              <span className="font-semibold text-slate-700">
                {joinedGroup?.name ||
                  "the study group"}
              </span>
              .

            </p>

            <p className="text-gray-500 mt-1">
              You can now find this group under
              <span className="font-semibold text-indigo-600">
                {" "}My Groups
              </span>
              .
            </p>

            {/* Buttons */}

            <div className="flex flex-col gap-3 mt-8">

              <button
                onClick={() =>
                  navigate("/groups")
                }
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Go to My Groups
              </button>

              <button
                onClick={() =>
                  setShowSuccess(false)
                }
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition"
              >
                Continue Exploring
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}