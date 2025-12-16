import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClients } from "../../api/clientsApi";

const Rating = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [participationRating, setParticipationRating] = useState(0);
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

  const handleClientToggle = (clientId) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleRatingClick = (rating) => {
    setParticipationRating(rating);
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
              Rating
            </h2>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Selection - Left Side */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Select Clients ({selectedClients.length} selected)
              </h3>

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
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        id={`client-${client.id}`}
                        checked={selectedClients.includes(client.id)}
                        onChange={() => handleClientToggle(client.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`client-${client.id}`}
                        className="ml-3 flex-1 cursor-pointer"
                      >
                        <p className="text-sm font-medium text-gray-900">
                          {client.first_name} {client.middle_name}{" "}
                          {client.last_name}
                        </p>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rating Section - Right Side */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Rate
              </h3>

              {/* Participation Rating */}
              <div className="mb-6 flex items-center gap-6">
                <h4 className="text-lg font-medium text-gray-700">
                  Participation
                </h4>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingClick(rating)}
                      className="w-8 h-8 flex items-center justify-center text-sm font-semibold transition-all"
                      style={{
                        borderRadius: '50%',
                        border: '2px solid black',
                        backgroundColor: participationRating === rating ? 'black' : 'transparent',
                        color: participationRating === rating ? 'white' : 'black'
                      }}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;
