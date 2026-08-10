import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getPublicSubjects,
  joinGroup,
} from "../../services/exploreService";

export default function ExploreSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await getPublicSubjects();
      setSubjects(data || []);
    } catch (error) {
      toast.error("Unable to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      return toast.error("Enter invite code");
    }

    try {
      await joinGroup(inviteCode);

      toast.success("Joined successfully");

      setInviteCode("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to join group"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-4xl font-bold">
              Explore Subjects
            </h1>

            <p className="text-gray-500 mt-2">
              Discover public subjects and join study groups.
            </p>

          </div>

        </div>

        {/* Join Group */}

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-10">

          <h2 className="text-2xl font-bold mb-5">
            Join Group
          </h2>

          <div className="flex gap-4">

            <input
              type="text"
              placeholder="Enter Invite Code"
              value={inviteCode}
              onChange={(e) =>
                setInviteCode(e.target.value)
              }
              className="flex-1 border rounded-xl p-3"
            />

            <button
              onClick={handleJoin}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-xl"
            >
              Join
            </button>

          </div>

        </div>

        {/* Subjects */}

        {subjects.length === 0 ? (

          <div className="bg-white rounded-3xl shadow p-10 text-center">

            <h2 className="text-2xl font-bold">
              No Public Subjects
            </h2>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

            {subjects.map((subject) => (

              <div
                key={subject._id}
                className="bg-white rounded-3xl shadow-lg p-6"
              >

                <div className="flex justify-between items-center">

                  <h2 className="text-2xl font-bold">
                    {subject.name}
                  </h2>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      subject.visibility === "group"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {subject.visibility === "group"
                      ? "👥 Group"
                      : "🌍 Public"}
                  </span>

                </div>

                <p className="text-gray-500 mt-3">
                  {subject.description}
                </p>

                <div className="mt-5">

                  <div className="w-full h-3 rounded-full bg-gray-200">

                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{
                        width: `${subject.progress}%`,
                      }}
                    />

                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    Progress {subject.progress}%
                  </p>

                </div>

                <div className="mt-6 space-y-2">

                  <p>
                    👤 Creator:
                    <span className="font-semibold ml-2">
                      {subject.user?.name || "Unknown"}
                    </span>
                  </p>

                  <p>
                    👥 Members:
                    <span className="font-semibold ml-2">
                      {subject.members?.length || 1}
                    </span>
                  </p>

                </div>

                <button
                  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
                >
                  View Subject
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}