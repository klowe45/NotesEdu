import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClients } from "../../api/clientsApi";
import { createDaily } from "../../api/dailiesApi";
import { createRating } from "../../api/ratingsApi";
import {
  getCategoriesByTeacher,
  createCategory,
  deleteCategory,
  initializeDefaultCategories
} from "../../api/categoriesApi";
import SuccessModal from "../Modal/SuccessModal";

const Dailies = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dailyText, setDailyText] = useState(() => {
    const saved = localStorage.getItem("dailies_text");
    return saved || "";
  });
  const [selectedClients, setSelectedClients] = useState(() => {
    const saved = localStorage.getItem("dailies_selectedClients");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const saved = localStorage.getItem("dailies_selectedCategories");
    return saved ? JSON.parse(saved) : [];
  });
  const [categoryRatings, setCategoryRatings] = useState(() => {
    const saved = localStorage.getItem("dailies_categoryRatings");
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem("dailies_selectedDate");
    return saved || new Date().toISOString().split("T")[0];
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedData, setSavedData] = useState({
    clientCount: 0,
    categories: [],
  });
  const [categories, setCategories] = useState([]);
  const [categoryObjects, setCategoryObjects] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const teacherData = localStorage.getItem("teacher");
        const teacher = teacherData ? JSON.parse(teacherData) : null;

        if (!teacher?.id) {
          console.error("No teacher ID found");
          setLoadingCategories(false);
          return;
        }

        const data = await getCategoriesByTeacher(teacher.id);

        // If no categories exist, initialize with defaults
        if (data.length === 0) {
          await initializeDefaultCategories(teacher.id);
          const newData = await getCategoriesByTeacher(teacher.id);
          setCategoryObjects(newData);
          setCategories(newData.map(cat => cat.name));
        } else {
          setCategoryObjects(data);
          setCategories(data.map(cat => cat.name));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Save to localStorage whenever values change
  useEffect(() => {
    localStorage.setItem("dailies_text", dailyText);
  }, [dailyText]);

  useEffect(() => {
    localStorage.setItem("dailies_selectedClients", JSON.stringify(selectedClients));
  }, [selectedClients]);

  useEffect(() => {
    localStorage.setItem("dailies_selectedCategories", JSON.stringify(selectedCategories));
  }, [selectedCategories]);

  useEffect(() => {
    localStorage.setItem("dailies_categoryRatings", JSON.stringify(categoryRatings));
  }, [categoryRatings]);

  useEffect(() => {
    localStorage.setItem("dailies_selectedDate", selectedDate);
  }, [selectedDate]);

  const handleReturn = () => {
    navigate("/");
  };

  const handleAddCategory = async () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      try {
        const teacherData = localStorage.getItem("teacher");
        const teacher = teacherData ? JSON.parse(teacherData) : null;

        if (!teacher?.id) {
          alert("No teacher ID found. Please log in again.");
          return;
        }

        const newCat = await createCategory(teacher.id, newCategory.trim());
        setCategoryObjects([...categoryObjects, newCat]);
        setCategories([...categories, newCat.name]);
        setNewCategory("");
        setShowAddCategory(false);
      } catch (err) {
        console.error("Error creating category:", err);
        alert(err.message || "Failed to create category. Please try again.");
      }
    }
  };

  const handleRemoveCategory = async (categoryToRemove) => {
    if (confirm(`Are you sure you want to remove "${categoryToRemove}"?`)) {
      try {
        const categoryObj = categoryObjects.find(cat => cat.name === categoryToRemove);
        if (categoryObj) {
          await deleteCategory(categoryObj.id);
          setCategoryObjects(categoryObjects.filter((cat) => cat.id !== categoryObj.id));
          setCategories(categories.filter((cat) => cat !== categoryToRemove));
          // Also remove from selected categories if it was selected
          setSelectedCategories(selectedCategories.filter((cat) => cat !== categoryToRemove));
        }
      } catch (err) {
        console.error("Error deleting category:", err);
        alert("Failed to delete category. Please try again.");
      }
    }
  };

  const handleDailyTextChange = (e) => {
    setDailyText(e.target.value);
  };

  const handleClientToggle = (clientId) => {
    setSelectedClients((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleCategoryRating = (clientId, category, rating) => {
    setCategoryRatings((prev) => ({
      ...prev,
      [clientId]: {
        ...(prev[clientId] || {}),
        [category]: rating,
      },
    }));
  };

  const handleSaveDailies = async () => {
    if (selectedClients.length === 0) {
      alert("Please select at least one client to save dailies to.");
      return;
    }

    if (selectedCategories.length === 0) {
      alert("Please select at least one category for the dailies.");
      return;
    }

    if (!dailyText.trim()) {
      alert("Please enter some daily.");
      return;
    }

    try {
      // Get logged-in teacher ID from localStorage
      const teacherData = localStorage.getItem("teacher");
      const teacher = teacherData ? JSON.parse(teacherData) : null;
      const teacherId = teacher?.id || null;

      // Create dailies and ratings for each selected client and each selected category
      for (const clientId of selectedClients) {
        for (const category of selectedCategories) {
          // Create the daily entry
          const dailyEntry = await createDaily(clientId, {
            teacher_id: teacherId,
            title: category,
            body: dailyText.trim(),
            date: selectedDate,
          });

          // Check if there's a rating for this client and category
          const ratingValue = categoryRatings[clientId]?.[category];
          if (ratingValue) {
            // Save the rating to the database
            await createRating({
              client_id: clientId,
              category: category,
              rating_value: ratingValue,
              daily_id: dailyEntry.id,
              teacher_id: teacherId,
              date: selectedDate,
              notes: null,
            });
          }
        }
      }

      console.log(
        "Dailies and ratings saved to clients:",
        selectedClients,
        "Notes:",
        dailyText,
        "Categories:",
        selectedCategories,
        "Ratings:",
        categoryRatings
      );

      // Save data for modal before resetting
      setSavedData({
        clientCount: selectedClients.length,
        categories: selectedCategories,
      });

      // Show success modal
      setShowSuccessModal(true);

      // Reset after saving
      setDailyText("");
      setSelectedClients([]);
      setSelectedCategories([]);
      setCategoryRatings({});
      // Clear localStorage
      localStorage.removeItem("dailies_text");
      localStorage.removeItem("dailies_selectedClients");
      localStorage.removeItem("dailies_selectedCategories");
      localStorage.removeItem("dailies_categoryRatings");
    } catch (err) {
      console.error("Error saving dailies:", err);
      alert("Failed to save dailies. Please try again.");
    }
  };

  const handleClearDailies = () => {
    setDailyText("");
    setSelectedClients([]);
    setSelectedCategories([]);
    setCategoryRatings({});
    // Clear localStorage (but not categories since they're in the database)
    localStorage.removeItem("dailies_text");
    localStorage.removeItem("dailies_selectedClients");
    localStorage.removeItem("dailies_selectedCategories");
    localStorage.removeItem("dailies_categoryRatings");
  };

  return (
    <div className="p-4 pb-20">
      <div className="container mx-auto">
        {/* Header with Navigation Buttons */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-8">
            <button
              className="flex items-center px-2 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 group mb-4 lg:mb-0"
              onClick={handleReturn}
            >
              <svg
                className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-1 transition-transform duration-200"
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

            <h2 className="text-4xl font-bold text-gray-900 text-center mb-4 lg:mb-0 lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
              Dailies
            </h2>

            <button
              className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => navigate("/clients")}
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
              <span className="font-medium">View Clients</span>
            </button>
          </div>
        </div>

        {/* Dailies Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Notes Input Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Write Daily
              </h3>

              {/* Category Selection */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Categories ({selectedCategories.length} selected)
                  </label>
                  <button
                    onClick={() => setShowAddCategory(!showAddCategory)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Category
                  </button>
                </div>

                {/* Add Category Form */}
                {showAddCategory && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                        placeholder="Enter new category name"
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <button
                        onClick={handleAddCategory}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddCategory(false);
                          setNewCategory("");
                        }}
                        className="px-3 py-1.5 text-sm bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {loadingCategories ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600 text-sm">Loading categories...</p>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-600 text-sm">No categories yet. Click "Add Category" to create one.</p>
                    </div>
                  ) : (
                    categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 hover:bg-gray-50 rounded transition-colors group"
                    >
                      <input
                        type="checkbox"
                        id={`category-${index}`}
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`category-${index}`}
                        className="ml-3 flex-1 cursor-pointer text-sm text-gray-900"
                      >
                        {category}
                      </label>
                      <button
                        onClick={() => handleRemoveCategory(category)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-all"
                        title="Remove category"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    ))
                  )}
                </div>
              </div>

              <textarea
                value={dailyText}
                onChange={handleDailyTextChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
                rows={10}
                placeholder="Type your daily notes here..."
              />
            </div>

            {/* Client Selection Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Select Clients ({selectedClients.length} selected)
              </h3>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading clients...</p>
                </div>
              ) : clients.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No clients found.</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Create a client first.
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

              {/* Date Selection */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={handleSaveDailies}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Dailies to Selected Clients
                </button>
                <button
                  onClick={handleClearDailies}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Selected Students Display */}
          {selectedClients.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Selected Clients ({selectedClients.length})
              </h3>
              <div className="space-y-3">
                {selectedClients.map((clientId) => {
                  const client = clients.find((c) => c.id === clientId);
                  return client ? (
                    <div
                      key={clientId}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {client.first_name} {client.middle_name}{" "}
                        {client.last_name}
                      </p>
                      {selectedCategories.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {selectedCategories.map((category, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm font-medium text-gray-900">
                                {category}
                              </span>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    onClick={() =>
                                      handleCategoryRating(clientId, category, rating)
                                    }
                                    className="w-6 h-6 flex items-center justify-center text-xs font-semibold transition-all"
                                    style={{
                                      borderRadius: "50%",
                                      border: "2px solid black",
                                      backgroundColor:
                                        categoryRatings[clientId]?.[category] === rating
                                          ? "black"
                                          : "transparent",
                                      color:
                                        categoryRatings[clientId]?.[category] === rating
                                          ? "white"
                                          : "black",
                                    }}
                                  >
                                    {rating}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Dailies Saved Successfully!"
        clientCount={savedData.clientCount}
        categories={savedData.categories}
      />
    </div>
  );
};

export default Dailies;
