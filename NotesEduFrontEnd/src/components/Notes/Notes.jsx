import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../Modal/SuccessModal";

const Notes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedData, setSavedData] = useState({ studentCount: 0, category: "" });

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
    "Social Studies",
  ];

  const handleReturn = () => {
    navigate("/");
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleStudentToggle = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSaveNotes = () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student to save notes to.");
      return;
    }

    if (!selectedCategory) {
      alert("Please select a category for the notes.");
      return;
    }

    // Update notes for each selected student
    selectedStudents.forEach((studentId) => {
      updateStudentNotes(studentId, notes, selectedCategory);
    });

    console.log(
      "Notes saved to students:",
      selectedStudents,
      "Notes:",
      notes,
      "Category:",
      selectedCategory
    );

    // Save data for modal before resetting
    setSavedData({
      studentCount: selectedStudents.length,
      category: selectedCategory,
    });

    // Show success modal
    setShowSuccessModal(true);

    // Reset after saving
    setNotes("");
    setSelectedStudents([]);
    setSelectedCategory("");
  };

  const handleClearNotes = () => {
    setNotes("");
    setSelectedStudents([]);
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
              onClick={() => navigate("/students")}
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
              <span className="font-medium">View Students</span>
            </button>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 text-center">
            Add Notes
          </h2>
        </div>

        {/* Notes Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notes Input Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Write Notes
              </h3>

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
            </div>

            {/* Student Selection Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Select Students ({selectedStudents.length} selected)
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {fakeStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      id={`student-${student.id}`}
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentToggle(student.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`student-${student.id}`}
                      className="ml-3 flex-1 cursor-pointer"
                    >
                      <p className="text-sm font-medium text-gray-900">
                        {student.firstName} {student.middleName}{" "}
                        {student.lastName}
                      </p>
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Notes to Selected Students
                </button>
                <button
                  onClick={handleClearNotes}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
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
        studentCount={savedData.studentCount}
        category={savedData.category}
      />
    </div>
  );
};

export default Notes;
