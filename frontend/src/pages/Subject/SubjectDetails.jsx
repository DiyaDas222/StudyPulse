import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

import { getSubjectById } from "../../services/subjectService";
import TopicList from "../../components/topic/TopicList";

export default function SubjectDetails() {
  const { id } = useParams();

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubject();
  }, [id]);

  const fetchSubject = async () => {
    try {
      setLoading(true);

      const data = await getSubjectById(id);

      setSubject(data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load subject");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading Subject...
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Subject not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">

      <div className="max-w-7xl mx-auto p-8">

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-indigo-600 font-semibold mb-6"
        >
          <FaArrowLeft />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <div className="flex justify-between items-center">

            <div>

              <h1 className="text-4xl font-bold text-slate-800">
                {subject.name}
              </h1>

              <p className="text-gray-500 mt-2">
                {subject.description || "No description available."}
              </p>

            </div>

            <div className="text-right">

              <p className="text-sm text-gray-500">
                Progress
              </p>

              <h2 className="text-3xl font-bold text-indigo-600">
                {subject.progress}%
              </h2>

            </div>

          </div>

          <div className="mt-8">

            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">

              <div
                className="h-full bg-indigo-600 transition-all"
                style={{
                  width: `${subject.progress}%`,
                }}
              />

            </div>

            <div className="flex justify-between mt-3 text-sm text-gray-500">

              <span>
                {subject.completedTopics} Completed
              </span>

              <span>
                {subject.totalTopics} Total
              </span>

            </div>

          </div>

        </div>

        <TopicList subjectId={id} />

      </div>

    </div>
  );
}