import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword } from "../../api/authApi";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: email, 2: token + password
  const [userType, setUserType] = useState("staff");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [generatedToken, setGeneratedToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await forgotPassword({
        email: email.trim(),
        userType: userType
      });

      if (result.error) {
        throw new Error(result.error);
      }

      // Store the token (in production, this would be sent via email)
      if (result.token) {
        setGeneratedToken(result.token);
        setSuccess("A reset code has been generated. Please enter it below along with your new password.");
        setStep(2);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to process request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token.trim()) {
      setError("Reset code is required");
      return;
    }

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await resetPassword({
        email: email.trim(),
        token: token.trim(),
        newPassword: newPassword,
        userType: userType
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setSuccess("Password reset successful! Redirecting to sign in...");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pb-20">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
              onClick={() => navigate("/signin")}
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
              <span className="font-medium">Back to Sign In</span>
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Forgot Password
            </h1>
            <p className="text-lg text-gray-600">
              {step === 1
                ? "Enter your email to reset your password"
                : "Enter the reset code and your new password"}
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {generatedToken && step === 2 && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm font-medium mb-2">Your Reset Code:</p>
              <p className="text-blue-900 text-2xl font-bold tracking-wider text-center">{generatedToken}</p>
              <p className="text-blue-700 text-xs mt-2">This code will expire in 15 minutes</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestReset}>
              <div className="space-y-4">
                {/* Account Type Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Account Type:
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="staff"
                        checked={userType === "staff"}
                        onChange={(e) => setUserType(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-900">Staff</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="organization"
                        checked={userType === "organization"}
                        onChange={(e) => setUserType(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-900">Organization</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value="viewer"
                        checked={userType === "viewer"}
                        onChange={(e) => setUserType(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-900">Viewer</span>
                    </label>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Get Reset Code"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="space-y-4">
                {/* Reset Code */}
                <div className="space-y-2">
                  <label
                    htmlFor="token"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Reset Code *
                  </label>
                  <input
                    id="token"
                    name="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter 6-digit reset code"
                    maxLength={6}
                    required
                  />
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    New Password *
                  </label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Enter new password (min 8 characters)"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </button>

                {/* Back Button */}
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setToken("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setError("");
                    setSuccess("");
                  }}
                  className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Back to Email Entry
                </button>
              </div>
            </form>
          )}

          {/* Back to Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/signin")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
