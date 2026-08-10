import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function SubjectBarChart({ subjects }) {
  const data = subjects.map((subject) => ({
    name: subject.name,
    progress: subject.progress,
  }));

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 h-[380px]">

      <h2 className="text-2xl font-bold mb-6">
        Subject Progress
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="progress"
            radius={[10, 10, 0, 0]}
            fill="#4F46E5"
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}