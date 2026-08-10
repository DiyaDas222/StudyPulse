import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import StatCard from "../../components/common/StatCard";
import SubjectCard from "../../components/dashboard/SubjectCard";
import SubjectModal from "../../modals/SubjectModal";

import ProgressPieChart from "../../components/dashboard/ProgressPieChart";
import SubjectBarChart from "../../components/dashboard/SubjectBarChart";

import { exportProgressPDF } from "../../utils/exportProgressPDF";

import {
  getSubjects,
  deleteSubject,
} from "../../services/subjectService";

export default function Dashboard() {
  const { user } = useAuth();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);

      const data = await getSubjects();

      setSubjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedSubject(null);
    setIsModalOpen(true);
  };

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this subject?"
    );

    if (!confirmDelete) return;

    try {
      await deleteSubject(id);

      toast.success("Subject deleted");

      await fetchSubjects();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete subject");
    }
  };

  const handleExportPDF = async () => {
    try {
      setExporting(true);

      await exportProgressPDF({
        elementId: "studypulse-progress-report",
        fileName: "StudyPulse-Progress-Report.pdf",
      });

      toast.success("Progress PDF exported successfully");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.message || "Unable to export PDF"
      );
    } finally {
      setExporting(false);
    }
  };

  const totalSubjects = subjects.length;

  const totalTopics = subjects.reduce(
    (sum, subject) =>
      sum + Number(subject.totalTopics || 0),
    0
  );

  const completedTopics = subjects.reduce(
    (sum, subject) =>
      sum + Number(subject.completedTopics || 0),
    0
  );

  const remainingTopics = Math.max(
    totalTopics - completedTopics,
    0
  );

  const progress =
    totalTopics === 0
      ? 0
      : Math.round(
          (completedTopics / totalTopics) * 100
        );

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />

      <div className="flex-1 min-w-0">

        <Navbar />

        <main className="p-8">

          {/* Header */}

          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">

            <div>

              <h1 className="text-4xl font-bold text-slate-800">
                Welcome, {user?.name || "Student"} 👋
              </h1>

              <p className="text-gray-500 mt-2">
                Keep your learning streak alive 🚀
              </p>

            </div>

            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {exporting
                ? "Exporting..."
                : "📄 Export Progress PDF"}
            </button>

          </div>

          {/* PDF REPORT AREA */}

          <div
            id="studypulse-progress-report"
            className="mt-8 bg-slate-100"
          >

            {/* Statistics */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

              <StatCard
                title="Subjects"
                value={totalSubjects}
              />

              <StatCard
                title="Topics"
                value={totalTopics}
              />

              <StatCard
                title="Completed"
                value={completedTopics}
              />

              <StatCard
                title="Progress"
                value={`${progress}%`}
              />

            </div>

            {/* Analytics */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">

              <ProgressPieChart
                completed={completedTopics}
                remaining={remainingTopics}
              />

              <SubjectBarChart
                subjects={subjects}
              />

            </div>

            {/* Subjects */}

            <div className="flex justify-between items-center mt-12 mb-6">

              <h2 className="text-3xl font-bold text-slate-800">
                Your Subjects
              </h2>

              <button
                onClick={handleAdd}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl transition font-semibold"
              >
                + Add Subject
              </button>

            </div>

            {loading ? (

              <div className="bg-white rounded-3xl shadow p-12 text-center">

                <p className="text-lg font-semibold text-gray-600">
                  Loading subjects...
                </p>

              </div>

            ) : subjects.length === 0 ? (

              <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

                <div className="text-5xl">
                  📚
                </div>

                <h2 className="text-3xl font-bold mt-4">
                  No Subjects Yet
                </h2>

                <p className="text-gray-500 mt-3">
                  Create your first subject to start learning.
                </p>

                <button
                  onClick={handleAdd}
                  className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Create Subject
                </button>

              </div>

            ) : (

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {subjects.map((subject) => (

                  <SubjectCard
                    key={subject._id}
                    subject={subject}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />

                ))}

              </div>

            )}

          </div>

        </main>

      </div>

      <SubjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSubject(null);
        }}
        subject={selectedSubject}
        onSuccess={fetchSubjects}
      />

    </div>
  );
}