import {
  HomeIcon,
  BookOpenIcon,
  UserGroupIcon,
  GlobeAltIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const menu = [
    {
      name: "Dashboard",
      icon: HomeIcon,
      path: "/dashboard",
    },
    {
      name: "Subjects",
      icon: BookOpenIcon,
      path: "/dashboard",
    },
    {
      name: "Groups",
      icon: UserGroupIcon,
      path: "/groups",
    },
    {
      name: "Explore",
      icon: GlobeAltIcon,
      path: "/explore",
    },
    {
      name: "Profile",
      icon: UserCircleIcon,
      path: "/profile",
    },
  ];

  return (
    <aside className="w-72 min-h-screen bg-gradient-to-b from-indigo-700 via-indigo-800 to-slate-900 text-white flex flex-col">

      <div className="p-8 border-b border-white/10">

        <h1 className="text-4xl font-bold">
          StudyPulse
        </h1>

        <p className="text-indigo-200 mt-2 text-sm">
          Smart Learning Workspace
        </p>

      </div>

      <nav className="flex-1 px-5 py-8 space-y-3">

        {menu.map((item) => {
          const Icon = item.icon;

          const active = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition ${
                active
                  ? "bg-white text-indigo-700"
                  : "hover:bg-white/10"
              }`}
            >
              <Icon className="w-6 h-6" />

              <span className="font-semibold">
                {item.name}
              </span>

            </Link>
          );
        })}

      </nav>

      <div className="p-5 border-t border-white/10">

        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-red-500 transition"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />

          <span className="font-semibold">
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}