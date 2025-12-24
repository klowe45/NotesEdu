import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isOwnerOrOrg, setIsOwnerOrOrg] = useState(false);
  const [isViewer, setIsViewer] = useState(false);

  useEffect(() => {
    // Check if user is a teacher/owner or organization
    const teacher = localStorage.getItem("teacher");
    const organization = localStorage.getItem("organization");
    const viewer = localStorage.getItem("viewer");
    setIsOwnerOrOrg(!!(teacher || organization));
    setIsViewer(!!viewer);
  }, [loggedIn]);

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("teacher");
    localStorage.removeItem("organization");
    localStorage.removeItem("viewer");
    // Set logged in to false
    setLoggedIn(false);
    // Navigate to home
    navigate("/");
  };

  return (
    <header className="header-container">
      {/* Left Section - Logout and Admin buttons */}
      {loggedIn && (
        <div className="left-section">
          <div className="left-buttons-group">
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

            {/* Admin dropdown - only show for owners and organizations, not viewers */}
            {isOwnerOrOrg && !isViewer && (
              <div className="admin-dropdown-container">
                <button
                  onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                  className="admin-button"
                >
                  <span>Admin</span>
                  <svg
                    className="admin-dropdown-icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isAdminDropdownOpen && (
                  <div className="admin-dropdown-menu">
                    <div className="admin-dropdown-section">
                      <button
                        onClick={() => {
                          navigate("/add-staff");
                          setIsAdminDropdownOpen(false);
                        }}
                        className="dropdown-menu-item"
                      >
                        Add Staff
                      </button>
                      <button
                        onClick={() => {
                          navigate("/staff-list");
                          setIsAdminDropdownOpen(false);
                        }}
                        className="dropdown-menu-item"
                      >
                        Staff List
                      </button>
                    </div>
                    <div className="admin-dropdown-divider"></div>
                    <div className="admin-dropdown-section">
                      <button
                        onClick={() => {
                          navigate("/add-viewer");
                          setIsAdminDropdownOpen(false);
                        }}
                        className="dropdown-menu-item"
                      >
                        Add Viewer
                      </button>
                      <button
                        onClick={() => {
                          navigate("/viewer-list");
                          setIsAdminDropdownOpen(false);
                        }}
                        className="dropdown-menu-item"
                      >
                        Viewer List
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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
              <button
                onClick={() => {
                  navigate("/viewer/signin");
                  setIsDropdownOpen(false);
                }}
                className="dropdown-menu-item"
              >
                Viewer Sign In
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
