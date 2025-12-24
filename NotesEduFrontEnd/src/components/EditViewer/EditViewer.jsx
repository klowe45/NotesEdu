import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getViewer, updateViewer, getViewerClients, updateViewerClients } from "../../api/authApi";
import { getAllClients } from "../../api/clientsApi";
import "./EditViewer.css";

const EditViewer = () => {
  const navigate = useNavigate();
  const { viewerId } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);
  const [selectedClientIds, setSelectedClientIds] = useState([]);

  useEffect(() => {
    fetchViewer();
  }, [viewerId]);

  const fetchViewer = async () => {
    try {
      // Fetch viewer data
      const viewerResult = await getViewer(viewerId);
      if (viewerResult.error) {
        throw new Error(viewerResult.error);
      }

      const viewer = viewerResult.viewer;
      setFormData({
        firstName: viewer.first_name || "",
        lastName: viewer.last_name || "",
        email: viewer.email || "",
      });

      // Fetch all clients
      const clientsResult = await getAllClients();
      setClients(clientsResult || []);

      // Fetch viewer's assigned clients
      const assignedClientsResult = await getViewerClients(viewerId);
      setSelectedClientIds(assignedClientsResult.clientIds || []);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching viewer:", err);
      setError(err.message || "Failed to load viewer");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClientToggle = (clientId) => {
    setSelectedClientIds(prev => {
      if (prev.includes(clientId)) {
        return prev.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
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

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Update viewer information
      const result = await updateViewer(viewerId, formData);
      if (result.error) {
        throw new Error(result.error);
      }

      // Update client assignments
      const clientsResult = await updateViewerClients(viewerId, selectedClientIds);
      if (clientsResult.error) {
        throw new Error(clientsResult.error);
      }

      console.log("Viewer updated successfully:", result);

      // Navigate to viewer list after successful update
      navigate("/viewer-list");
    } catch (err) {
      console.error("Error updating viewer:", err);
      setError(err.message || "Failed to update viewer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white-50 p-4 pb-20 flex items-center justify-center">
        <p className="text-gray-500">Loading viewer...</p>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Viewer</h1>
          <p className="text-lg text-gray-600">
            Update viewer account information
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

        {/* Clients Section */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Clients</h2>
          <p className="text-sm text-gray-600 mb-4">
            Select which clients this viewer can access
          </p>

          {clients.length === 0 ? (
            <p className="text-gray-500 text-sm">No clients available</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {clients.map((client) => (
                <label
                  key={client.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedClientIds.includes(client.id)}
                    onChange={() => handleClientToggle(client.id)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {client.first_name} {client.middle_name && `${client.middle_name} `}{client.last_name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditViewer;
