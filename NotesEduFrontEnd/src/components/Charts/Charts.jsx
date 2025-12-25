import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById } from "../../api/clientsApi";
import { getRatingsByClient } from "../../api/ratingsApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Charts = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const clientData = await getClientById(clientId);
        const ratingsData = await getRatingsByClient(clientId);
        setClient(clientData);
        setRatings(ratingsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load chart data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  // Load saved chart order from localStorage
  useEffect(() => {
    const savedOrder = localStorage.getItem(`chartOrder_${clientId}`);
    if (savedOrder) {
      try {
        setCategoryOrder(JSON.parse(savedOrder));
      } catch (err) {
        console.error("Error loading chart order:", err);
      }
    }
  }, [clientId]);

  // Group ratings by category
  const groupRatingsByCategory = () => {
    const grouped = {};
    ratings.forEach((rating) => {
      if (!grouped[rating.category]) {
        grouped[rating.category] = [];
      }
      grouped[rating.category].push({
        date: new Date(rating.date).toLocaleDateString(),
        rating: rating.rating_value,
        fullDate: new Date(rating.date),
      });
    });

    // Sort each category's data by date
    Object.keys(grouped).forEach((category) => {
      grouped[category].sort((a, b) => a.fullDate - b.fullDate);
    });

    return grouped;
  };

  const categorizedRatings = groupRatingsByCategory();

  // Get sorted categories based on saved order
  const getSortedCategories = () => {
    const categories = Object.keys(categorizedRatings);

    if (categoryOrder.length === 0) {
      return categories;
    }

    // Sort based on saved order, putting new categories at the end
    const sorted = [...categories].sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);

      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    });

    return sorted;
  };

  // Save chart order to localStorage
  const saveChartOrder = (newOrder) => {
    setCategoryOrder(newOrder);
    localStorage.setItem(`chartOrder_${clientId}`, JSON.stringify(newOrder));
  };

  // Drag handlers
  const handleDragStart = (e, category) => {
    setDraggedItem(category);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetCategory) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetCategory) {
      setDraggedItem(null);
      return;
    }

    const sortedCategories = getSortedCategories();
    const draggedIndex = sortedCategories.indexOf(draggedItem);
    const targetIndex = sortedCategories.indexOf(targetCategory);

    const newOrder = [...sortedCategories];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    saveChartOrder(newOrder);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleReturn = () => {
    navigate(`/client/${clientId}`);
  };

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading charts...</p>
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

  return (
    <div className="p-4 pb-20">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <button
              className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
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
          <h1 className="text-4xl font-bold text-gray-900 text-center mt-4">
            {client.first_name}{" "}
            {client.middle_name ? `${client.middle_name.charAt(0)}. ` : ""}
            {client.last_name}
          </h1>
          <p className="text-center text-gray-600 text-lg mt-2">
            Rating Charts
          </p>
        </div>

        {/* Charts */}
        <div className="max-w-6xl mx-auto space-y-8">
          {Object.keys(categorizedRatings).length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 text-center">
              <p className="text-gray-400 italic">
                No rating data available yet.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800 text-center">
                  💡 Drag and drop charts to reorder them. Your preferred order will be saved.
                </p>
              </div>
              {getSortedCategories().map((category) => {
                const data = categorizedRatings[category];
                const isDragging = draggedItem === category;

                return (
                  <div
                    key={category}
                    draggable
                    onDragStart={(e) => handleDragStart(e, category)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, category)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all duration-200 cursor-move ${
                      isDragging
                        ? "border-blue-500 opacity-50 scale-95"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-lg"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-semibold text-gray-800">
                        {category}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-400">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          label={{
                            value: "Date",
                            position: "insideBottom",
                            offset: -5,
                          }}
                        />
                        <YAxis
                          domain={[0, 5]}
                          ticks={[0, 1, 2, 3, 4, 5]}
                          label={{
                            value: "Rating",
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="rating"
                          stroke="#2563eb"
                          strokeWidth={2}
                          dot={{ fill: "#2563eb", r: 4 }}
                          activeDot={{ r: 6 }}
                          name="Rating"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Charts;
