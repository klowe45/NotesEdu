import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById } from "../../api/clientsApi";
import { getClientDailies } from "../../api/dailiesApi";

const ClientDailies = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [dailies, setDailies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

  const categories = [
    "Money Management",
    "Meal Prep",
    "Medocation Management",
    "Housekeeping",
    "Shopping",
    "transportation",
    "Communication",
    "Health Management",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const clientData = await getClientById(clientId);
        const dailiesData = await getClientDailies(clientId);
        setClient(clientData);
        setDailies(dailiesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dailies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  const handleReturn = () => {
    navigate(`/client/${clientId}`);
  };

  // Filter dailies based on selected category
  const getFilteredDailies = () => {
    if (!dailies || !Array.isArray(dailies)) {
      return [];
    }

    if (!selectedCategoryFilter) {
      return dailies;
    }

    return dailies.filter((daily) => daily.title === selectedCategoryFilter);
  };

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading dailies...</p>
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
              onClick={handleReturn}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredDailies = getFilteredDailies();

  return (
    <div className="p-4 pb-20">
      <div className="container mx-auto">
        {/* Header with Return Button */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
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
              <span className="font-medium">Back to Dashboard</span>
            </button>

            <h1 className="text-4xl font-bold text-gray-900 text-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
              {client.first_name}{" "}
              {client.middle_name ? `${client.middle_name.charAt(0)}. ` : ""}
              {client.last_name}
            </h1>
          </div>
          <p className="text-center text-gray-600 text-lg mt-2">All Dailies</p>
        </div>

        {/* Filter Bar */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Filter by Category:
                </span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                {selectedCategoryFilter && (
                  <span className="text-sm text-gray-600">
                    Showing:{" "}
                    <span className="font-medium text-blue-600">
                      {selectedCategoryFilter}
                    </span>
                  </span>
                )}
                <button
                  onClick={() => setSelectedCategoryFilter("")}
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors leading-none ml-2"
                  style={{ fontSize: "12px", padding: "4px 6px" }}
                  disabled={!selectedCategoryFilter}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dailies Grid */}
        <div className="max-w-6xl mx-auto">
          {filteredDailies.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 border border-gray-200 text-center">
              <p className="text-gray-400 italic text-lg">
                {selectedCategoryFilter
                  ? `No dailies found for ${selectedCategoryFilter} category.`
                  : "No dailies added yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDailies
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map((daily) => (
                  <div
                    key={daily.id}
                    className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    {daily.title && (
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {daily.title}
                        </span>
                      </div>
                    )}
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {daily.body}
                    </p>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      {daily.teacher_first && (
                        <p className="text-xs text-gray-500 mb-1">
                          Teacher: {daily.teacher_first} {daily.teacher_last}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {daily.date
                          ? new Date(daily.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : new Date(daily.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredDailies.length > 0 && (
          <div className="max-w-6xl mx-auto mt-6">
            <p className="text-center text-gray-600 text-sm">
              Showing {filteredDailies.length} daily
              {filteredDailies.length !== 1 ? "s" : ""}
              {selectedCategoryFilter && ` in ${selectedCategoryFilter}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDailies;
