import { motion } from "framer-motion";

export default function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1 }}
        className="bg-indigo-600 h-3 rounded-full"
      />
    </div>
  );
}