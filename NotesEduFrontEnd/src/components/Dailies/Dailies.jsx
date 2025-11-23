import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents } from "../../api/studentsApi";
import { createDaily } from "../../api/dailiesApi";
import SuccessModal from "../Modal/SuccessModal";

const Dailies = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dailyText, setDailyText] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedData, setSavedData] = useState({
    studentCount: 0,
    categories: [],
  });

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
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await getAllStudents();
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleReturn = () => {
    navigate("/");
  };

  const handleDailyTextChange = (e) => {
    setDailyText(e.target.value);
  };

  const handleStudentToggle = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleSaveDailies = async () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student to save dailies to.");
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

      // Create dailies for each selected student and each selected category
      const dailyPromises = [];
      selectedStudents.forEach((studentId) => {
        selectedCategories.forEach((category) => {
          dailyPromises.push(
            createDaily(studentId, {
              teacher_id: teacherId,
              title: category,
              body: dailyText.trim(),
            })
          );
        });
      });

      await Promise.all(dailyPromises);

      console.log(
        "Dailies saved to students:",
        selectedStudents,
        "Notes:",
        dailyText,
        "Categories:",
        selectedCategories
      );

      // Save data for modal before resetting
      setSavedData({
        studentCount: selectedStudents.length,
        categories: selectedCategories,
      });

      // Show success modal
      setShowSuccessModal(true);

      // Reset after saving
      setDailyText("");
      setSelectedStudents([]);
      setSelectedCategories([]);
    } catch (err) {
      console.error("Error saving dailies:", err);
      alert("Failed to save dailies. Please try again.");
    }
  };

  const handleClearDailies = () => {
    setDailyText("");
    setSelectedStudents([]);
    setSelectedCategories([]);
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
            Add Dailies
          </h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Categories ({selectedCategories.length} selected)
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 hover:bg-gray-50 rounded transition-colors"
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
                    </div>
                  ))}
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

            {/* Student Selection Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Select Students ({selectedStudents.length} selected)
              </h3>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading students...</p>
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No students found.</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Create a student first.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {students.map((student) => (
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
                          {student.first_name} {student.middle_name}{" "}
                          {student.last_name}
                        </p>
                      </label>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSaveDailies}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Dailies to Selected Students
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
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Dailies Saved Successfully!"
        studentCount={savedData.studentCount}
        categories={savedData.categories}
      />
    </div>
  );
};

export default Dailies;
