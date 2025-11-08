import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllStudents } from "../../api/studentsApi";
import { submitAttendance, getAllAttendance } from "../../api/attendanceApi";

const Attendance = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [attendance, setAttendance] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const [studentsData, attendanceRecords] = await Promise.all([
          getAllStudents(),
          getAllAttendance()
        ]);

        setStudents(studentsData);

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Filter attendance records for today
        const todayAttendance = attendanceRecords.filter(record => {
          const recordDate = new Date(record.date).toISOString().split('T')[0];
          return recordDate === today;
        });

        // Initialize attendance state
        const initialAttendance = {};
        studentsData.forEach(student => {
          // Check if this student has attendance marked for today
          const existingRecord = todayAttendance.find(record =>
            record.first_name === student.first_name &&
            record.last_name === student.last_name
          );

          // If they have a record and appeared is true, mark them as checked
          initialAttendance[student.id] = existingRecord ? existingRecord.appeared : false;
        });

        setAttendance(initialAttendance);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleCheckboxChange = (studentId) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      // Convert attendance object to array format for API
      const attendanceData = Object.entries(attendance)
        .filter(([_, appeared]) => appeared) // Only send students who are marked as present
        .map(([studentId, appeared]) => ({
          student_id: parseInt(studentId),
          appeared: appeared
        }));

      if (attendanceData.length === 0) {
        setError("Please select at least one student");
        setSubmitting(false);
        return;
      }

      await submitAttendance(attendanceData);
      setSuccess("Attendance submitted successfully!");

      // Reset attendance after successful submission
      setTimeout(() => {
        const resetAttendance = {};
        students.forEach(student => {
          resetAttendance[student.id] = false;
        });
        setAttendance(resetAttendance);
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Error submitting attendance:", err);
      setError("Failed to submit attendance. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturn = () => {
    navigate("/");
  };

  const handleHistory = () => {
    navigate("/attendance-history");
  };

  return (
    <div className="p-4 pb-20">
      <div className="container mx-auto">
        {/* Header with Return Button */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
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
              <span className="font-medium">Back to Home</span>
            </button>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 text-center">
            Attendance
          </h2>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Attendance"}
            </button>
            <button
              onClick={handleHistory}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Attendance History
            </button>
          </div>
        </div>

        {/* Attendance List */}
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{success}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No students found.</p>
              <p className="text-gray-500 text-sm mt-2">
                Create a new student to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    id={`student-${student.id}`}
                    checked={attendance[student.id] || false}
                    onChange={() => handleCheckboxChange(student.id)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor={`student-${student.id}`}
                    className="ml-4 text-lg text-gray-800 cursor-pointer flex-1"
                  >
                    {student.first_name} {student.middle_name} {student.last_name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
