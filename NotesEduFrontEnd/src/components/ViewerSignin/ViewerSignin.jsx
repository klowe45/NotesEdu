import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { viewerSignin } from "../../api/authApi";
import "./ViewerSignin.css";

const ViewerSignin = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      const result = await viewerSignin(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      console.log("Viewer signin successful:", result);

      // Store viewer data in localStorage
      localStorage.setItem("viewer", JSON.stringify(result.viewer));

      // Update logged in state
      setLoggedIn(true);

      // Navigate to clients page
      navigate("/clients");
    } catch (err) {
      console.error("Error signing in:", err);
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pb-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Viewer Sign In
          </h1>
          <p className="text-lg text-gray-600">
            Access your assigned clients
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email *
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
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewerSignin;
