import { BellIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
  return (
    <div className="h-20 bg-white shadow-sm px-8 flex justify-between items-center">
      <div>
        <h1 className="font-bold text-2xl text-indigo-600">
          StudyPulse
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <BellIcon className="w-6 h-6 text-gray-600 cursor-pointer" />

        <div className="w-11 h-11 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
          D
        </div>
      </div>
    </div>
  );
}