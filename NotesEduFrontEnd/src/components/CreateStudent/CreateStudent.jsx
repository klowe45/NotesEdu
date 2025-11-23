import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FormSample from "../FormSample/FormSample";
import { createClient } from "../../api/clientsApi";

const CreateStudent = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const clientData = {
        first_name: firstName.trim(),
        middle_name: middleName.trim() || null,
        last_name: lastName.trim(),
      };

      const result = await createClient(clientData);
      console.log("Client created:", result);

      navigate("/clients");
    } catch (error) {
      console.error("Error creating client:", error);
      setError(
        error.message || "Failed to create client. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white-50 p-4 pb-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            className="flex items-center px-3 py-2 text-white hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
            onClick={handleReturn}
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
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create New Client
          </h1>
          <p className="text-lg text-gray-600">
            Add a new client to your dashboard
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
        <FormSample
          title="Client Information"
          submitText={isSubmitting ? "Creating..." : "Create Client"}
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstname"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="middlename"
                  className="block text-sm font-medium text-gray-700"
                >
                  Middle Name
                </label>
                <input
                  id="middlename"
                  type="text"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter middle name (optional)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="lastname"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>
        </FormSample>
      </div>
    </div>
  );
};

export default CreateStudent;
