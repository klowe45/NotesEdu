import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById } from "../../api/clientsApi";

const BasicInformation = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const clientData = await getClientById(clientId);
        setClient(clientData);
      } catch (err) {
        console.error("Error fetching client data:", err);
        setError("Failed to load client data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleBack = () => {
    navigate(`/client/${clientId}`);
  };

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading client data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="p-4 pb-20">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">
              {error || "Client not found"}
            </p>
            <button
              onClick={handleBack}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-start">
              <button
                className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                onClick={handleBack}
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
            <div className="flex-1 text-center">
              <h1 className="text-4xl font-bold text-gray-900">
                Basic Information
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                {client.first_name}{" "}
                {client.middle_name ? `${client.middle_name.charAt(0)}. ` : ""}
                {client.last_name}
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isEditing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={!isEditing}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
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
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information Form */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={client.first_name}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  value={client.middle_name || ""}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={client.last_name}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;
