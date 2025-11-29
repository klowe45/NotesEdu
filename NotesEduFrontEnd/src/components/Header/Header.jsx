import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

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
    <header className="header-container">
      {/* Logout Button - Left side */}
      {loggedIn && (
        <div className="left-section">
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            <svg
              className="logout-icon"
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
            <span className="logout-text">Logout</span>
          </button>
        </div>
      )}

      {/* Dropdown Button - Left side - Only show when not logged in */}
      {!loggedIn && (
        <div className="left-section">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="dropdown-button"
          >
            <svg
              className="dropdown-icon"
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
            <div className="dropdown-menu">
              <button
                onClick={() => {
                  navigate("/signin");
                  setIsDropdownOpen(false);
                }}
                className="dropdown-menu-item"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  navigate("/signup");
                  setIsDropdownOpen(false);
                }}
                className="dropdown-menu-item"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}

      <h1 className="header-logo">NeuroNotes</h1>
    </header>
  );
};

export default Header;
