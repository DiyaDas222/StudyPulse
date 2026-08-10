import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

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
      const data = await getMyGroups();
      setGroups(data);
    } catch (error) {
      toast.error("Unable to load groups");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <h1 className="text-4xl font-bold">
            My Groups
          </h1>

          <p className="text-gray-500 mt-2">
            All study groups you've created or joined.
          </p>

          {loading ? (

            <div className="mt-10 text-lg font-semibold">
              Loading...
            </div>

          ) : groups.length === 0 ? (

            <div className="bg-white rounded-3xl shadow-lg p-10 mt-10 text-center">

              <h2 className="text-3xl font-bold">
                👥 No Groups Yet
              </h2>

              <p className="mt-3 text-gray-500">
                Create a subject with visibility set to Group
                or join one using an invite code.
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">

              {groups.map((group) => (

                <div
                  key={group._id}
                  className="bg-white rounded-3xl shadow-lg p-6"
                >

                  <div className="flex justify-between">

                    <h2 className="text-2xl font-bold">
                      {group.name}
                    </h2>

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      Group
                    </span>

                  </div>

                  <p className="mt-3 text-gray-500">
                    {group.description || "No description"}
                  </p>

                  <div className="mt-5 space-y-2">

                    <p>
                      📊 Progress:
                      <strong className="ml-2">
                        {group.progress}%
                      </strong>
                    </p>

                    <p>
                      👥 Members:
                      <strong className="ml-2">
                        {group.members?.length || 1}
                      </strong>
                    </p>

                    <p>
                      🔑 Invite Code:
                      <strong className="ml-2">
                        {group.inviteCode || "-"}
                      </strong>
                    </p>

                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(group.inviteCode);
                      toast.success("Invite code copied");
                    }}
                    className="w-full mt-6 bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-xl"
                  >
                    Copy Invite Code
                  </button>

                  <Link
                    to={`/subject/${group._id}`}
                    className="block text-center w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
                  >
                    Open Group
                  </Link>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}