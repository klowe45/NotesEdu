import { useLocation, useNavigate } from "react-router-dom";
import mainImg from "../../assets/main-image-classroom.jpg";
import Actions from "../Actions/Actions";
import "./Main.css";

const Main = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();

  console.log("Main component - loggedIn:", loggedIn);
  console.log("localStorage teacher:", localStorage.getItem("teacher"));

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
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                    Our Mission
                  </h3>
                </div>
                <p className="text-center text-gray-700 text-lg md:text-xl leading-relaxed font-light">
                  Our mission is to empower care programs and educators with simple, reliable tools that support meaningful documentation, consistent care, and human growth—so staff can focus less on paperwork and more on people.
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
            {/* Welcome Message */}
            <div className="max-w-4xl mx-auto mb-10 px-4">
              <div className="bg-white border-l-4 border-blue-600 rounded-r-lg shadow-sm p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Welcome Back!</h2>
                    <p className="text-gray-600">
                      Thank you for using NeuroNotes. We're here to help you make a difference every day.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-container">
              <Actions />
            </div>

            {/* Mission Statement */}
            <div className="max-w-4xl mx-auto mt-16 px-4 pb-8">
              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-gray-200 p-8 md:p-10">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
                    Our Mission
                  </h3>
                </div>

                <p className="text-center text-gray-700 text-lg md:text-xl leading-relaxed font-light">
                  Our mission is to empower care programs and educators with simple, reliable tools that support meaningful documentation, consistent care, and human growth—so staff can focus less on paperwork and more on people.
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
