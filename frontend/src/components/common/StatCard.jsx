import { motion } from "framer-motion";

export default function StatCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-md p-6"
    >
      <h3 className="text-gray-500 text-sm">{title}</h3>

      <h1 className="text-3xl font-bold mt-2 text-slate-800">
        {value}
      </h1>
    </motion.div>
  );
}