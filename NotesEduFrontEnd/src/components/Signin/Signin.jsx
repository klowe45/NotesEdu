import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signin, organizationSignin, viewerSignin } from "../../api/authApi";

const Signin = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState("staff"); // "staff", "organization", or "viewer"
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (accountType === "organization") {
        result = await organizationSignin({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        // Store organization data in localStorage
        if (result.organization) {
          localStorage.setItem("organization", JSON.stringify(result.organization));
          // Clear any other user data if present
          localStorage.removeItem("teacher");
          localStorage.removeItem("viewer");
        }
      } else if (accountType === "viewer") {
        result = await viewerSignin({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        // Store viewer data in localStorage
        if (result.viewer) {
          localStorage.setItem("viewer", JSON.stringify(result.viewer));
          // Clear any other user data if present
          localStorage.removeItem("teacher");
          localStorage.removeItem("organization");
        }
      } else {
        result = await signin({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (result.error) {
          throw new Error(result.error);
        }

        // Store teacher data in localStorage
        if (result.teacher) {
          localStorage.setItem("teacher", JSON.stringify(result.teacher));
          // Clear any other user data if present
          localStorage.removeItem("organization");
          localStorage.removeItem("viewer");
        }
      }

      console.log("Signin successful:", result);

      // Set logged in state to true
      setLoggedIn(true);

      // Navigate to main dashboard or home
      navigate("/");
    } catch (err) {
      console.error("Signin error:", err);
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white-50 p-4 pb-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
            onClick={() => navigate("/")}
          >
            <svg
              className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back to Home</span>
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign In</h1>
          <p className="text-lg text-gray-600">
            Welcome back to NeuroNotes
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-md mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          {/* Account Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sign in as:
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="accountType"
                  value="staff"
                  checked={accountType === "staff"}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-900">Staff</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="accountType"
                  value="organization"
                  checked={accountType === "organization"}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-900">Organization</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="accountType"
                  value="viewer"
                  checked={accountType === "viewer"}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-900">Viewer</span>
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-black hover:text-gray-700 transition-colors bg-transparent border-none p-0 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
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
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>

              {/* Forgot Password Button */}
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="w-full px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                Forgot Password?
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an organization account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Track Client Progress Section */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Track client progress!</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Streamline client assessment, organize notes, and gain insights into progress
            patterns with our intuitive teacher dashboard.
          </p>
        </div>

        {/* About NeuroNotes Section */}
        <div className="mt-12 text-center bg-white rounded-lg shadow-md p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            About NeuroNotes
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            NeuroNotes makes it easy to track client progress, manage charts, and stay
            organized with a clean, intuitive dashboard.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="mt-12 mb-8">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-gray-200 p-8 md:p-10">
            <div className="text-center mb-6">
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
      </div>
    </div>
  );
};

export default Signin;
