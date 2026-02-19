import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 p-6 border-r border-gray-800">
      <h2 className="text-2xl font-bold text-blue-500 mb-10">
        Assignment Evaluation & Feedback Platform
      </h2>

      <nav className="space-y-4">
        <Link to="/student" className="block text-gray-400 hover:text-white">
          Student Dashboard
        </Link>

        <Link to="/instructor" className="block text-gray-400 hover:text-white">
          Instructor Dashboard
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
