import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentById } from "../../api/studentsApi";
import { getStudentNotes } from "../../api/notesApi";
import { getStudentAttendance } from "../../api/attendanceApi";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [notes, setNotes] = useState([]);
  const [attendance, setAttendance] = useState([]);
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
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const studentData = await getStudentById(studentId);
        const notesData = await getStudentNotes(studentId);
        setStudent(studentData);
        setNotes(notesData);

        // Fetch attendance records after we have student data
        if (studentData) {
          const attendanceData = await getStudentAttendance(
            studentData.first_name,
            studentData.last_name
          );
          setAttendance(attendanceData);
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError("Failed to load student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  const handleReturn = () => {
    navigate("/students");
  };

  // Filter notes based on selected category
  const getFilteredNotes = () => {
    if (!notes || !Array.isArray(notes)) {
      return [];
    }

    if (!selectedCategoryFilter) {
      return notes;
    }

    return notes.filter((note) => note.title === selectedCategoryFilter);
  };

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading student data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-4 pb-20">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">
              {error || "Student not found"}
            </p>
            <button
              onClick={handleReturn}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Students
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <div className="container mx-auto">
        {/* Header with Return Button */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
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
              <span className="font-medium">Back to Students</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            {student.first_name}{" "}
            {student.middle_name ? `${student.middle_name.charAt(0)}. ` : ""}
            {student.last_name}
          </h1>
          <p className="text-center text-gray-600 text-lg mt-2">
            Dashboard
          </p>
        </div>

        {/* Navigation Bar with Filter */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Filter Notes by Category:
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

        {/* Student Information */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-600">
                    {student.first_name}{" "}
                    {student.middle_name
                      ? `${student.middle_name.charAt(0)}. `
                      : ""}
                    {student.last_name}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(student.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Notes</h3>
              </div>
              <div className="space-y-4">
                {(() => {
                  const filteredNotes = getFilteredNotes();
                  return Array.isArray(filteredNotes) &&
                    filteredNotes.length > 0 ? (
                    filteredNotes.map((note, index) => (
                      <div
                        key={note.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            {note.title && (
                              <h4 className="font-semibold text-gray-800 mb-1">
                                {note.title}
                              </h4>
                            )}
                            <p className="text-gray-600 leading-relaxed">
                              {note.body}
                            </p>
                            {note.teacher_first && (
                              <p className="text-xs text-gray-500 mt-2">
                                Teacher: {note.teacher_first}{" "}
                                {note.teacher_last}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              Created:{" "}
                              {new Date(note.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : selectedCategoryFilter ? (
                    <p className="text-gray-400 italic">
                      No notes found for {selectedCategoryFilter} category.
                    </p>
                  ) : (
                    <p className="text-gray-400 italic">No notes added yet.</p>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Attendance Records Section */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Attendance Records
              </h3>
              {attendance.length === 0 ? (
                <p className="text-gray-400 italic">
                  No attendance records found.
                </p>
              ) : (
                <div className="space-y-3">
                  {attendance
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((record) => (
                      <div
                        key={record.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          record.appeared
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {new Date(record.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            record.appeared
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.appeared ? "Present" : "Absent"}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
