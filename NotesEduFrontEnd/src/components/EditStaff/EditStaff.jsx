import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStaffMember, updateStaff } from "../../api/authApi";
import "./EditStaff.css";

const EditStaff = () => {
  const navigate = useNavigate();
  const { staffId } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    isAdmin: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffMember();
  }, [staffId]);

  const fetchStaffMember = async () => {
    try {
      const result = await getStaffMember(staffId);

      if (result.error) {
        throw new Error(result.error);
      }

      const staff = result.staff;

      // Format date for input field (YYYY-MM-DD)
      const formattedDate = staff.date_of_birth
        ? new Date(staff.date_of_birth).toISOString().split('T')[0]
        : "";

      setFormData({
        firstName: staff.first_name || "",
        middleName: staff.middle_name || "",
        lastName: staff.last_name || "",
        dateOfBirth: formattedDate,
        email: staff.email || "",
        isAdmin: staff.role === "admin",
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching staff member:", err);
      setError(err.message || "Failed to load staff member");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return;
    }

    if (!formData.dateOfBirth) {
      setError("Date of birth is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateStaff(staffId, formData);

      if (result.error) {
        throw new Error(result.error);
      }

      console.log("Staff member updated successfully:", result);

      // Navigate to staff list after successful update
      navigate("/staff-list");
    } catch (err) {
      console.error("Error updating staff:", err);
      setError(err.message || "Failed to update staff member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white-50 p-4 pb-20 flex items-center justify-center">
        <p className="text-gray-500">Loading staff member...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-50 p-4 pb-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
            onClick={() => navigate(-1)}
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
            <span className="font-medium">Back</span>
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Staff Member</h1>
          <p className="text-lg text-gray-600">
            Update staff account information
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* First Name */}
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter first name"
                  required
                />
              </div>

              {/* Middle Name */}
              <div className="space-y-2">
                <label
                  htmlFor="middleName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Middle Name
                </label>
                <input
                  id="middleName"
                  name="middleName"
                  type="text"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter middle name (optional)"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter last name"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth *
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>

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
                  placeholder="Enter email address"
                  required
                />
              </div>

              {/* Admin Checkbox */}
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    id="isAdmin"
                    name="isAdmin"
                    type="checkbox"
                    checked={formData.isAdmin}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Grant admin privileges
                  </span>
                </label>
                <p className="text-xs text-gray-500 ml-8">
                  Admin users can manage staff and organization settings
                </p>
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStaff;
