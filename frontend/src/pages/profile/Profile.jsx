import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getProfile } from "../../services/profileService";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      toast.error("Unable to load profile");
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-8">

      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h1 className="text-4xl font-bold">
            My Profile
          </h1>

          <div className="mt-8 grid md:grid-cols-2 gap-6">

            <div className="bg-slate-50 rounded-2xl p-6">

              <h2 className="text-xl font-semibold">
                Name
              </h2>

              <p className="mt-2 text-lg">
                {profile.user.name}
              </p>

            </div>

            <div className="bg-slate-50 rounded-2xl p-6">

              <h2 className="text-xl font-semibold">
                Email
              </h2>

              <p className="mt-2 text-lg">
                {profile.user.email}
              </p>

            </div>

            <div className="bg-slate-50 rounded-2xl p-6">

              <h2 className="text-xl font-semibold">
                Subjects
              </h2>

              <p className="mt-2 text-3xl font-bold">
                {profile.totalSubjects}
              </p>

            </div>

            <div className="bg-slate-50 rounded-2xl p-6">

              <h2 className="text-xl font-semibold">
                Topics
              </h2>

              <p className="mt-2 text-3xl font-bold">
                {profile.totalTopics}
              </p>

            </div>

            <div className="bg-slate-50 rounded-2xl p-6">

              <h2 className="text-xl font-semibold">
                Completed
              </h2>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {profile.completedTopics}
              </p>

            </div>

            <div className="bg-slate-50 rounded-2xl p-6">

              <h2 className="text-xl font-semibold">
                Overall Progress
              </h2>

              <p className="mt-2 text-3xl font-bold text-indigo-600">
                {profile.progress}%
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}