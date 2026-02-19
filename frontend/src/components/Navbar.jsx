import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Navbar({ role = "student", username = "User" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // if using auth
    navigate("/");
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-sky-400 cursor-pointer"
        >
          EvalPlatform
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">

          {role === "instructor" && (
            <NavLink
              to="/instructor"
              className={({ isActive }) =>
                isActive
                  ? "text-sky-400 font-semibold"
                  : "hover:text-sky-400 transition"
              }
            >
              Dashboard
            </NavLink>
          )}

          {role === "student" && (
            <NavLink
              to="/student"
              className={({ isActive }) =>
                isActive
                  ? "text-sky-400 font-semibold"
                  : "hover:text-sky-400 transition"
              }
            >
              Dashboard
            </NavLink>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-700 transition"
            >
              {username}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-44 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
                <button
                  className="block w-full text-left px-4 py-3 hover:bg-slate-700 transition"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 hover:bg-red-600 hover:text-white text-red-400 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800 px-6 py-6 space-y-4 border-t border-slate-700">

          {role === "instructor" && (
            <NavLink
              to="/instructor"
              className="block hover:text-sky-400"
              onClick={() => setMenuOpen(false)}
            >
              Instructor Dashboard
            </NavLink>
          )}

          {role === "student" && (
            <NavLink
              to="/student"
              className="block hover:text-sky-400"
              onClick={() => setMenuOpen(false)}
            >
              Student Dashboard
            </NavLink>
          )}

          <button
            onClick={handleLogout}
            className="block text-left w-full text-red-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
