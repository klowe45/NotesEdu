import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUnreadCount } from "../../api/notificationsApi";
import "./Header.css";

const Header = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [isOwnerOrOrg, setIsOwnerOrOrg] = useState(false);
  const [isViewer, setIsViewer] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Check if user is a teacher/owner or organization
    const teacher = localStorage.getItem("teacher");
    const organization = localStorage.getItem("organization");
    const viewer = localStorage.getItem("viewer");
    setIsOwnerOrOrg(!!(teacher || organization));
    setIsViewer(!!viewer);

    // Fetch unread notification count for organization users
    const fetchUnreadCount = async () => {
      if (organization) {
        try {
          const org = JSON.parse(organization);
          const data = await getUnreadCount(org.id);
          setUnreadCount(data.count || 0);
        } catch (err) {
          console.error("Error fetching unread count:", err);
        }
      }
    };

    if (loggedIn && organization) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
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
                          navigate("/notifications");
                          setIsAdminDropdownOpen(false);
                        }}
                        className="dropdown-menu-item notifications-item"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ width: '18px', height: '18px' }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                          </svg>
                          <span>Notifications</span>
                        </div>
                        {unreadCount > 0 && (
                          <span
                            style={{
                              backgroundColor: '#ef4444',
                              color: 'white',
                              borderRadius: '9999px',
                              padding: '2px 8px',
                              fontSize: '11px',
                              fontWeight: '600',
                              minWidth: '20px',
                              textAlign: 'center'
                            }}
                          >
                            {unreadCount}
                          </span>
                        )}
                      </button>
                    </div>

                    <div className="admin-dropdown-divider"></div>

                    <div className="admin-dropdown-section">
                      <div className="admin-dropdown-section-title">Staff Management</div>
                      <button
                        onClick={() => {
                          navigate("/add-staff");
                          setIsAdminDropdownOpen(false);
                        }}
                        className="dropdown-menu-item"
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ width: '18px', height: '18px' }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                        Add Staff
                      </button>
                      <button
                        onClick={() => {
                          navigate("/staff-list");
                          setIsAdminDropdownOpen(false);
                        }}
                        className="dropdown-menu-item"
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ width: '18px', height: '18px' }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Staff List
                      </button>
                    </div>

                    <div className="admin-dropdown-divider"></div>

                    <div className="admin-dropdown-section">
                      <div className="admin-dropdown-section-title">Viewer Management</div>
                      <button
                        onClick={() => {
                          navigate("/add-viewer");
                          setIsAdminDropdownOpen(false);
                        }}
                        className="dropdown-menu-item"
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ width: '18px', height: '18px' }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                        Add Viewer
                      </button>
                      <button
                        onClick={() => {
                          navigate("/viewer-list");
                          setIsAdminDropdownOpen(false);
                        }}
                        className="dropdown-menu-item"
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ width: '18px', height: '18px' }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
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
