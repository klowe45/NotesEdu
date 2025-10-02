import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fakeClients, updateClientNotes } from "../utils/FakeClients";
import SuccessModal from "../Modal/SuccessModal";

const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [selectedClients, setSelectedClients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedData, setSavedData] = useState({ clientCount: 0, category: "" });

  const categories = [
    "Reading",
    "Writing",
    "Math",
    "Science",
    "History",
    "Art",
    "Music",
    "Physical Education",
    "Spanish",
    "Social Studies"
  ];

  const handleReturn = () => {
    navigate("/");
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleClientToggle = (clientId) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSaveNotes = () => {
    if (selectedClients.length === 0) {
      alert("Please select at least one client to save notes to.");
      return;
    }

    if (!selectedCategory) {
      alert("Please select a category for the notes.");
      return;
    }

    // Update notes for each selected client
    selectedClients.forEach(clientId => {
      updateClientNotes(clientId, notes, selectedCategory);
    });

    console.log("Notes saved to clients:", selectedClients, "Notes:", notes, "Category:", selectedCategory);

    // Save data for modal before resetting
    setSavedData({
      clientCount: selectedClients.length,
      category: selectedCategory
    });

    // Show success modal
    setShowSuccessModal(true);

    // Reset after saving
    setNotes("");
    setSelectedClients([]);
    setSelectedCategory("");
  };

  const handleClearNotes = () => {
    setNotes("");
    setSelectedClients([]);
    setSelectedCategory("");
  };

  return (
    <div className="p-4 pb-20">
      <div className="container mx-auto">
        {/* Header with Navigation Buttons */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              className="flex items-center px-2 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 group"
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
          <h2 className="text-4xl font-bold text-gray-900 text-center">
            Type notes here
          </h2>
        </div>

        {/* Notes Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notes Input Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Write Notes</h3>

              {/* Category Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Choose a category...</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={notes}
                onChange={handleNotesChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-vertical"
                rows={10}
                placeholder="Type your notes here..."
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Notes to Selected Clients
                </button>
                <button
                  onClick={handleClearNotes}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Client Selection Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Select Clients ({selectedClients.length} selected)
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {fakeClients.map((client) => (
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
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {client.firstName} {client.middleName} {client.lastName}
                          </p>
                          <p className="text-xs text-gray-500">Grade {client.grade}</p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {client.subjects.slice(0, 2).map((subject, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {subject}
                            </span>
                          ))}
                          {client.subjects.length > 2 && (
                            <span className="text-xs text-gray-500">+{client.subjects.length - 2}</span>
                          )}
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Notes Saved Successfully!"
        clientCount={savedData.clientCount}
        category={savedData.category}
      />
    </div>
  );
};

export default Notes;
