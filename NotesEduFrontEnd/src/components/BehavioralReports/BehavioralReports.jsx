import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClients } from "../../api/clientsApi";

const BehavioralReports = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await getAllClients();
        setClients(data);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to load clients. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleReturn = () => {
    navigate("/");
  };

  const handleClientClick = (clientId) => {
    navigate(`/upload-reports/${clientId}`);
  };

  return (
    <div className="p-4 pb-20">
      <div className="container mx-auto">
        {/* Header with Return Button */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-8">
            <button
              className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group mb-4 lg:mb-0"
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
              <span className="font-medium">Back to Home</span>
            </button>

            <h2 className="text-4xl font-bold text-gray-900 text-center mb-4 lg:mb-0 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
              Behavioral Reports
            </h2>
          </div>
        </div>

        {/* Students List */}
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading clients...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No clients found.</p>
              <p className="text-gray-500 text-sm mt-2">
                Create a new client to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => handleClientClick(client.id)}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer active:scale-95 active:shadow-sm flex items-center justify-center"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 text-center">
                      {client.first_name} {client.middle_name}{" "}
                      {client.last_name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BehavioralReports;
