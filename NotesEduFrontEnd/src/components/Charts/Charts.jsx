import { useState, useEffect, useRef } from "react";
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
  const [orderHistory, setOrderHistory] = useState([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [tempOrder, setTempOrder] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

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

  // Save chart order to localStorage with history
  const saveChartOrder = (newOrder) => {
    const currentOrder = categoryOrder.length > 0 ? categoryOrder : getSortedCategories();
    setOrderHistory((prev) => [...prev, currentOrder].slice(-10)); // Keep last 10 states
    setCategoryOrder(newOrder);
    localStorage.setItem(`chartOrder_${clientId}`, JSON.stringify(newOrder));
  };

  // Reset to default order
  const handleResetOrder = () => {
    const currentOrder = categoryOrder.length > 0 ? categoryOrder : getSortedCategories();
    setOrderHistory((prev) => [...prev, currentOrder].slice(-10));
    setCategoryOrder([]);
    localStorage.removeItem(`chartOrder_${clientId}`);
    setShowResetConfirm(false);
  };

  // Undo last reorder
  const handleUndo = () => {
    if (orderHistory.length === 0) return;

    const previousOrder = orderHistory[orderHistory.length - 1];
    setOrderHistory((prev) => prev.slice(0, -1));
    setCategoryOrder(previousOrder);
    localStorage.setItem(`chartOrder_${clientId}`, JSON.stringify(previousOrder));
  };

  // Open order modal
  const openOrderModal = () => {
    setTempOrder(getSortedCategories());
    setShowOrderModal(true);
  };

  // Save order from modal
  const handleSaveOrder = () => {
    saveChartOrder(tempOrder);
    setShowOrderModal(false);
    setTempOrder([]);
  };

  // Cancel order changes
  const handleCancelOrder = () => {
    setShowOrderModal(false);
    setTempOrder([]);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Move item up in modal
  const moveItemUp = (index) => {
    if (index === 0) return;
    const newOrder = [...tempOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setTempOrder(newOrder);
  };

  // Move item down in modal
  const moveItemDown = (index) => {
    if (index === tempOrder.length - 1) return;
    const newOrder = [...tempOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setTempOrder(newOrder);
  };

  // Modal drag handlers
  const handleModalDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleModalDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleModalDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleModalDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newOrder = [...tempOrder];
    const [draggedItem] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(dropIndex, 0, draggedItem);

    setTempOrder(newOrder);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleModalDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
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
              {/* Controls Bar */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-sm text-blue-800 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Customize the order of your charts
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={openOrderModal}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      Change Order
                    </button>
                    {orderHistory.length > 0 && (
                      <button
                        onClick={handleUndo}
                        className="px-3 py-2 bg-white text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 border border-blue-300 transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow"
                        title="Undo last reorder"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Undo
                      </button>
                    )}
                    {categoryOrder.length > 0 && (
                      <button
                        onClick={() => setShowResetConfirm(true)}
                        className="px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 border border-gray-300 transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow"
                        title="Reset to default order"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Modal */}
              {showOrderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                  <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full my-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">Change Chart Order</h3>
                      <button
                        onClick={handleCancelOrder}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <p className="text-gray-600 mb-4 text-sm">
                      Drag items to reorder, or use the arrow buttons. Your changes will be saved when you click "Save Order".
                    </p>

                    <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                      {tempOrder.map((category, index) => {
                        const isDragging = draggedIndex === index;
                        const isDropTarget = dragOverIndex === index;

                        return (
                          <div
                            key={category}
                            draggable
                            onDragStart={(e) => handleModalDragStart(e, index)}
                            onDragOver={(e) => handleModalDragOver(e, index)}
                            onDragLeave={handleModalDragLeave}
                            onDrop={(e) => handleModalDrop(e, index)}
                            onDragEnd={handleModalDragEnd}
                            className={`
                              flex items-center justify-between p-4 rounded-lg border-2
                              transition-all duration-200 cursor-move
                              ${isDragging
                                ? "border-blue-500 opacity-50 scale-95 bg-blue-50"
                                : isDropTarget
                                ? "border-green-500 bg-green-50 scale-[1.02]"
                                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                              }
                            `}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm">
                                  {index + 1}
                                </div>
                                <span className="text-lg font-medium text-gray-800">{category}</span>
                              </div>
                            </div>

                            <div className="flex gap-1">
                              <button
                                onClick={() => moveItemUp(index)}
                                disabled={index === 0}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                  index === 0
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                }`}
                                title="Move up"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => moveItemDown(index)}
                                disabled={index === tempOrder.length - 1}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                  index === tempOrder.length - 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                }`}
                                title="Move down"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={handleCancelOrder}
                        className="px-6 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveOrder}
                        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
                      >
                        Save Order
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reset Confirmation Modal */}
              {showResetConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Reset Chart Order?</h3>
                    <p className="text-gray-600 mb-6">This will restore the default order. You can always rearrange them again.</p>
                    <div className="flex gap-3 justify-end">
                      <button
                        onClick={() => setShowResetConfirm(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleResetOrder}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Reset Order
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Chart Cards */}
              {getSortedCategories().map((category) => {
                const data = categorizedRatings[category];

                return (
                  <div
                    key={category}
                    className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="mb-4">
                      <h3 className="text-2xl font-semibold text-gray-800">
                        {category}
                      </h3>
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
