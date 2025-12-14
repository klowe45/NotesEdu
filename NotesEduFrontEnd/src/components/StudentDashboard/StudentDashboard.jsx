import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById } from "../../api/clientsApi";
import { getClientNotes } from "../../api/notesApi";
import { getClientAttendance } from "../../api/attendanceApi";
import { getClientDailies } from "../../api/dailiesApi";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [dailies, setDailies] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const clientData = await getClientById(clientId);
        const notesData = await getClientNotes(clientId);
        const dailiesData = await getClientDailies(clientId);
        setClient(clientData);
        setNotes(notesData);
        setDailies(dailiesData);

        // Fetch attendance records after we have client data
        if (clientData) {
          const attendanceData = await getClientAttendance(
            clientData.first_name,
            clientData.last_name
          );
          setAttendance(attendanceData);
        }
      } catch (err) {
        console.error("Error fetching client data:", err);
        setError("Failed to load client data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleReturn = () => {
    navigate("/clients");
  };

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading client data...</p>
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
              Back to Clients
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
              <span className="font-medium">Back to Clients</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            {client.first_name}{" "}
            {client.middle_name ? `${client.middle_name.charAt(0)}. ` : ""}
            {client.last_name}
          </h1>
          <p className="text-center text-gray-600 text-lg mt-2">
            Dashboard
          </p>
        </div>

        {/* Student Information */}
        <div className="max-w-4xl mx-auto">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Basic Information
            </h3>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-600">
                  {client.first_name}{" "}
                  {client.middle_name
                    ? `${client.middle_name.charAt(0)}. `
                    : ""}
                  {client.last_name}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(client.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Notes</h3>
                <button
                  onClick={() => navigate(`/client/${clientId}/notes`)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View All
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                {Array.isArray(notes) && notes.length > 0 ? (
                  notes.map((note) => (
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
                ) : (
                  <p className="text-gray-400 italic">No notes added yet.</p>
                )}
              </div>
            </div>

          {/* Dailies Section */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Dailies</h3>
                <button
                  onClick={() => navigate(`/client/${clientId}/dailies`)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View All
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              {dailies.length === 0 ? (
                <p className="text-gray-400 italic">No dailies added yet.</p>
              ) : (
                <div className="space-y-3">
                  {dailies
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((daily) => (
                      <div
                        key={daily.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            {daily.title && (
                              <h4 className="font-semibold text-gray-800 mb-1">
                                {daily.title}
                              </h4>
                            )}
                            <p className="text-gray-600 leading-relaxed">
                              {daily.body}
                            </p>
                            {daily.teacher_first && (
                              <p className="text-xs text-gray-500 mt-2">
                                Teacher: {daily.teacher_first}{" "}
                                {daily.teacher_last}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              Created:{" "}
                              {new Date(daily.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
          </div>

          {/* Attendance Records Section */}
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
  );
};

export default StudentDashboard;
