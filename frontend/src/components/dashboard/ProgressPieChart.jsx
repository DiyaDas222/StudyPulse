import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ProgressPieChart({
  completed = 0,
  remaining = 0,
}) {
  const completedValue = Number(completed) || 0;
  const remainingValue = Number(remaining) || 0;

  const total = completedValue + remainingValue;

  const data =
    total === 0
      ? [{ name: "No Topics", value: 1 }]
      : [
          {
            name: "Completed",
            value: completedValue,
          },
          {
            name: "Remaining",
            value: remainingValue,
          },
        ];

  const COLORS =
    total === 0
      ? ["#E5E7EB"]
      : ["#4F46E5", "#E5E7EB"];

  const percentage =
    total === 0
      ? 0
      : Math.round(
          (completedValue / total) * 100
        );

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <div className="mb-4">

        <h2 className="text-2xl font-bold text-slate-800">
          Overall Progress
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Completed vs remaining topics
        </p>

      </div>

      <div className="relative w-full h-[300px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
            >

              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                />
              ))}

            </Pie>

            <Tooltip />

            {total > 0 && (
              <Legend />
            )}

          </PieChart>
        </ResponsiveContainer>

        {/* Center percentage */}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

          <div className="text-center">

            <p className="text-3xl font-bold text-indigo-600">
              {percentage}%
            </p>

            <p className="text-xs text-gray-500">
              Complete
            </p>

          </div>

        </div>

      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">

        <div className="bg-indigo-50 rounded-2xl p-4">

          <p className="text-sm text-gray-500">
            Completed
          </p>

          <p className="text-2xl font-bold text-indigo-600">
            {completedValue}
          </p>

        </div>

        <div className="bg-gray-50 rounded-2xl p-4">

          <p className="text-sm text-gray-500">
            Remaining
          </p>

          <p className="text-2xl font-bold text-gray-700">
            {remainingValue}
          </p>

        </div>

      </div>

    </div>
  );
}