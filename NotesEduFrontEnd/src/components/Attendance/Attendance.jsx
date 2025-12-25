import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClients } from "../../api/clientsApi";
import { submitAttendance, getAllAttendance } from "../../api/attendanceApi";

const Attendance = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [attendance, setAttendance] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedToday, setSubmittedToday] = useState(new Set());

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const [clientsData, attendanceRecords] = await Promise.all([
          getAllClients(),
          getAllAttendance()
        ]);

        setClients(clientsData);

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Filter attendance records for today
        const todayAttendance = attendanceRecords.filter(record => {
          const recordDate = new Date(record.date).toISOString().split('T')[0];
          return recordDate === today;
        });

        // Track clients who already have attendance submitted today
        const submittedSet = new Set();
        todayAttendance.forEach(record => {
          const key = `${record.first_name.toLowerCase()}_${record.last_name.toLowerCase()}`;
          submittedSet.add(key);
        });
        setSubmittedToday(submittedSet);

        // Initialize attendance state
        const initialAttendance = {};
        clientsData.forEach(client => {
          // Check if this client has attendance marked for today
          const existingRecord = todayAttendance.find(record =>
            record.first_name === client.first_name &&
            record.last_name === client.last_name
          );

          // If they have a record and appeared is true, mark them as checked
          initialAttendance[client.id] = existingRecord ? existingRecord.appeared : false;
        });

        setAttendance(initialAttendance);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to load clients. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const hasAttendanceToday = (client) => {
    const key = `${client.first_name.toLowerCase()}_${client.last_name.toLowerCase()}`;
    return submittedToday.has(key);
  };

  const handleCheckboxChange = (clientId) => {
    setAttendance(prev => ({
      ...prev,
      [clientId]: !prev[clientId]
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
        setError("Please select at least one client");
        setSubmitting(false);
        return;
      }

      await submitAttendance(attendanceData);
      setSuccess("Attendance submitted successfully!");

      // Reset attendance after successful submission
      setTimeout(() => {
        const resetAttendance = {};
        clients.forEach(client => {
          resetAttendance[client.id] = false;
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
              Attendance
            </h2>

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
            <>
              <div className="space-y-3">
                {clients.map((client) => {
                  const alreadySubmitted = hasAttendanceToday(client);
                  return (
                    <div
                      key={client.id}
                      className={`flex items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 ${
                        alreadySubmitted ? 'opacity-75 bg-green-50 border-green-300' : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`client-${client.id}`}
                        checked={attendance[client.id] || false}
                        onChange={() => handleCheckboxChange(client.id)}
                        disabled={alreadySubmitted}
                        className={`w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                          alreadySubmitted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                        }`}
                      />
                      <label
                        htmlFor={`client-${client.id}`}
                        className={`ml-4 text-lg flex-1 ${
                          alreadySubmitted ? 'text-gray-600 cursor-default' : 'text-gray-800 cursor-pointer'
                        }`}
                      >
                        {client.first_name} {client.middle_name} {client.last_name}
                      </label>

                      {/* Green checkmark for already submitted */}
                      {alreadySubmitted && (
                        <div className="ml-auto">
                          <div className="bg-green-500 rounded-full p-1.5 shadow-md">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
                >
                  {submitting ? "Submitting..." : "Submit Attendance"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
