import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import mainImg from "../../assets/main-image-classroom.jpg";
import Actions from "../Actions/Actions";
import { getWelcomeMessage, getActiveNotification } from "../../api/notificationsApi";
import "./Main.css";

const Main = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [activeNotifications, setActiveNotifications] = useState([]);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);

  console.log("Main component - loggedIn:", loggedIn);
  console.log("localStorage teacher:", localStorage.getItem("teacher"));

  useEffect(() => {
    const fetchMessages = async () => {
      const orgData = localStorage.getItem("organization");
      if (orgData && loggedIn) {
        try {
          const org = JSON.parse(orgData);

          // Fetch active notifications
          const notifications = await getActiveNotification(org.id);
          setActiveNotifications(notifications);
          setCurrentNotificationIndex(0);

          // Fetch welcome message
          const data = await getWelcomeMessage(org.id);
          setWelcomeMessage(data.welcome_message || "");
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      }
    };

    fetchMessages();
  }, [loggedIn]);

  const handleNextNotification = () => {
    if (currentNotificationIndex < activeNotifications.length - 1) {
      setCurrentNotificationIndex(currentNotificationIndex + 1);
    }
  };

  const handlePreviousNotification = () => {
    if (currentNotificationIndex > 0) {
      setCurrentNotificationIndex(currentNotificationIndex - 1);
    }
  };

  const currentNotification = activeNotifications[currentNotificationIndex];

  return (
    <main className="main-container">
      <div className="hero-section">
        {/* Sign In and Sign Up buttons - Only show when not logged in */}
        {!loggedIn && (
          <>
            <div className="auth-buttons-container">
              <button
                onClick={() => navigate("/signin")}
                className="signin-button"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="signup-button"
              >
                Sign Up
              </button>
            </div>

            {/* Mission Statement */}
            <div className="mt-12 mb-8 max-w-4xl mx-auto px-4">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-gray-200 p-8 md:p-10">
                <div className="text-center mb-6">
                  <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                    Our Mission
                  </h3>
                </div>
                <p className="text-center text-gray-700 text-lg md:text-xl leading-relaxed font-light">
                  Our mission is to empower care programs and educators with
                  simple, reliable tools that support meaningful documentation,
                  consistent care, and human growth so staff can focus less on
                  paperwork and more on people.
                </p>
                <div className="flex justify-center mt-6">
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </>
        )}

        {loggedIn && (
          <>
            {/* Welcome Message or Active Notification */}
            <div className="max-w-6xl mx-auto mb-10 px-4">
              {currentNotification ? (
                // Display active notification with navigation
                <div className={`w-full min-w-[900px] border-l-4 rounded-r-lg shadow-lg p-6 min-h-[140px] flex flex-col justify-center ${
                  currentNotification.type === 'success' ? 'bg-green-50 border-green-600' :
                  currentNotification.type === 'warning' ? 'bg-yellow-50 border-yellow-600' :
                  currentNotification.type === 'error' ? 'bg-red-50 border-red-600' :
                  'bg-blue-50 border-blue-600'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                      Notification {activeNotifications.length > 1 && `(${currentNotificationIndex + 1} of ${activeNotifications.length})`}
                    </p>

                    {/* Navigation arrows - only show if there are 2+ notifications */}
                    {activeNotifications.length > 1 && (
                      <div className="flex items-center gap-2">
                        {/* Previous arrow */}
                        <button
                          onClick={handlePreviousNotification}
                          disabled={currentNotificationIndex === 0}
                          className={`rounded-full p-2 border border-gray-300 transition-all ${
                            currentNotificationIndex === 0
                              ? 'opacity-30 cursor-not-allowed bg-gray-100'
                              : 'hover:bg-white hover:shadow-md cursor-pointer bg-white'
                          }`}
                        >
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {/* Next arrow */}
                        <button
                          onClick={handleNextNotification}
                          disabled={currentNotificationIndex === activeNotifications.length - 1}
                          className={`rounded-full p-2 border border-gray-300 transition-all ${
                            currentNotificationIndex === activeNotifications.length - 1
                              ? 'opacity-30 cursor-not-allowed bg-gray-100'
                              : 'hover:bg-white hover:shadow-md cursor-pointer bg-white'
                          }`}
                        >
                          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {currentNotification.title}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {currentNotification.message}
                  </p>
                </div>
              ) : welcomeMessage ? (
                // Display custom welcome message
                <div className="w-full min-w-[900px] bg-white border-l-4 border-blue-600 rounded-r-lg shadow-sm p-6 min-h-[140px] flex items-center">
                  <p className="text-lg text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {welcomeMessage}
                  </p>
                </div>
              ) : (
                // Display default welcome message
                <div className="w-full min-w-[900px] bg-white border-l-4 border-blue-600 rounded-r-lg shadow-sm p-6 min-h-[140px] flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                    Welcome Back!
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Thank you for using NeuroNotes. We're here to help you make a
                    difference every day.
                  </p>
                </div>
              )}
            </div>

            <div className="action-container">
              <Actions />
            </div>

            {/* Mission Statement */}
            <div className="max-w-4xl mx-auto mt-16 px-4 pb-8">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-gray-200 p-8 md:p-10">
                <div className="text-center mb-6">
                  <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                    Our Mission
                  </h3>
                </div>

                <p className="text-center text-gray-700 text-lg md:text-xl leading-relaxed font-light">
                  Our mission is to empower care programs with simple, reliable
                  tools that support meaningful documentation, consistent care,
                  and human growth so staff can focus less on paperwork and more
                  on people.
                </p>

                {/* Bottom accent */}
                <div className="flex justify-center mt-6">
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Main;
