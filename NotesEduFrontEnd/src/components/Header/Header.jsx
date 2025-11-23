import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("teacher");
    // Set logged in to false
    setLoggedIn(false);
    // Navigate to home
    navigate("/");
  };

  return (
    <header className="flex justify-end items-center py-3 sm:py-4 md:py-5 lg:py-4 border-b-2 border-gray-200 mb-4 sm:mb-5 md:mb-6 lg:mb-6 relative">
      {/* Logout Button - Left side */}
      {loggedIn && (
        <div className="absolute left-0">
          <button
            onClick={handleLogout}
            className="flex items-center px-2 py-1.5 sm:px-2 sm:py-1.5 md:px-3 md:py-2 text-xs sm:text-sm md:text-base lg:text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-4 lg:h-4 mr-1 sm:mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}

      {/* Dropdown Button - Left side - Only show when not logged in */}
      {!loggedIn && (
        <div className="absolute left-0">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center px-3 py-2 sm:px-4 sm:py-2 md:px-4 md:py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-6 lg:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-40 sm:w-44 md:w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
              <button
                onClick={() => {
                  navigate("/signin");
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  navigate("/signup");
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}

      <h1 className="text-black text-lg sm:text-xl md:text-2xl lg:text-xl font-bold m-0 ml-2 sm:ml-2.5 md:ml-3 lg:ml-2.5">NeuroNotes</h1>
    </header>
  );
};

export default Header;
