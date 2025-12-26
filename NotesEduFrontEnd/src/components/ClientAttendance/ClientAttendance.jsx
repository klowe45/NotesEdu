import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById } from "../../api/clientsApi";
import { getClientAttendance } from "../../api/attendanceApi";

const ClientAttendance = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, present, absent

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const clientData = await getClientById(clientId);
        setClient(clientData);

        if (clientData) {
          const attendanceData = await getClientAttendance(
            clientData.first_name,
            clientData.last_name
          );
          setAttendance(attendanceData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load attendance records. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId]);

  const handleReturn = () => {
    navigate(`/client/${clientId}`);
  };

  // Filter attendance based on selected status
  const getFilteredAttendance = () => {
    if (!attendance || !Array.isArray(attendance)) {
      return [];
    }

    if (filterStatus === "all") {
      return attendance;
    }

    return attendance.filter((record) =>
      filterStatus === "present" ? record.appeared : !record.appeared
    );
  };

  if (loading) {
    return (
      <div className="p-4 pb-20">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading attendance records...</p>
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

  const filteredAttendance = getFilteredAttendance();

  return (
    <div className="p-4 pb-20">
      <div className="container mx-auto">
        {/* Header with Return Button */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
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
              <span className="font-medium">Back to Dashboard</span>
            </button>

            <h1 className="text-4xl font-bold text-gray-900 text-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
              {client.first_name}{" "}
              {client.middle_name ? `${client.middle_name.charAt(0)}. ` : ""}
              {client.last_name}
            </h1>
          </div>
          <p className="text-center text-gray-600 text-lg mt-2">Attendance History</p>
        </div>

        {/* Filter Bar */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Filter by Status:
                </span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option value="all">All Records</option>
                  <option value="present">Present Only</option>
                  <option value="absent">Absent Only</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {filterStatus !== "all" && (
                  <span className="text-sm text-gray-600">
                    Showing:{" "}
                    <span className="font-medium text-blue-600">
                      {filterStatus === "present" ? "Present" : "Absent"}
                    </span>
                  </span>
                )}
                <button
                  onClick={() => setFilterStatus("all")}
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors leading-none ml-2"
                  style={{ fontSize: "12px", padding: "4px 6px" }}
                  disabled={filterStatus === "all"}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Records */}
        <div className="max-w-4xl mx-auto">
          {filteredAttendance.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 border border-gray-200 text-center">
              <p className="text-gray-400 italic text-lg">
                {filterStatus !== "all"
                  ? `No ${filterStatus} records found.`
                  : "No attendance records found."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAttendance
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((record) => (
                  <div
                    key={record.id}
                    className={`flex items-center justify-between p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow ${
                      record.appeared
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          record.appeared
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.appeared ? "Present" : "Absent"}
                      </span>
                      {record.appeared ? (
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Summary */}
        {filteredAttendance.length > 0 && (
          <div className="max-w-4xl mx-auto mt-6">
            <p className="text-center text-gray-600 text-sm">
              Showing {filteredAttendance.length} record
              {filteredAttendance.length !== 1 ? "s" : ""}
              {filterStatus !== "all" && ` (${filterStatus})`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientAttendance;
