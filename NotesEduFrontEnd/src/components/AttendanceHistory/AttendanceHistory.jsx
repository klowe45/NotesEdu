import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllClients } from "../../api/clientsApi";
import { getAllAttendance } from "../../api/attendanceApi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AttendanceHistory.css";

const AttendanceHistory = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedClient, setExpandedClient] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clientsData, attendanceData] = await Promise.all([
          getAllClients(),
          getAllAttendance()
        ]);
        setClients(clientsData);
        setAttendanceRecords(attendanceData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load attendance history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleReturn = () => {
    navigate("/attendance");
  };

  const toggleClient = (clientId) => {
    setExpandedClient(expandedClient === clientId ? null : clientId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getClientsPresentOnDate = () => {
    if (!selectedDate) return [];

    const selectedDateStr = selectedDate.toISOString().split('T')[0];

    return attendanceRecords.filter(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === selectedDateStr && record.appeared === true;
    });
  };

  const clientsPresent = getClientsPresentOnDate();

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
              <span className="font-medium">Back to Attendance</span>
            </button>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 text-center">
            Attendance History
          </h2>
        </div>

        {/* Calendar Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
            View Attendance by Date
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 flex justify-center">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="border-0"
              />
            </div>

            {/* Clients Present on Selected Date */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Clients Present on {formatDate(selectedDate)}
              </h4>

              {clientsPresent.length === 0 ? (
                <p className="text-gray-500 italic text-sm">No clients were marked present on this date.</p>
              ) : (
                <div className="space-y-2">
                  {clientsPresent.map((record) => (
                    <div
                      key={record.id}
                      className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-900">
                        {record.first_name} {record.last_name}
                      </span>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                        Present
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Attendance History Table */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
            All Clients
          </h3>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Loading attendance history...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No clients found.</p>
              <p className="text-gray-500 text-sm mt-2">
                Create a new client to get started.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Records
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.map((client) => {
                    const clientRecords = attendanceRecords.filter(
                      record =>
                        record.first_name === client.first_name &&
                        record.last_name === client.last_name
                    );
                    const totalRecords = clientRecords.length;
                    const isExpanded = expandedClient === client.id;

                    return (
                      <>
                        <tr
                          key={client.id}
                          onClick={() => toggleClient(client.id)}
                          className="hover:bg-gray-50 cursor-pointer"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <div className="flex items-center">
                              <svg
                                className={`w-4 h-4 mr-2 transition-transform ${
                                  isExpanded ? 'transform rotate-90' : ''
                                }`}
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
                              {client.first_name} {client.middle_name} {client.last_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {totalRecords}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${client.id}-details`}>
                            <td colSpan="2" className="px-6 py-4 bg-gray-50">
                              {clientRecords.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No attendance records found</p>
                              ) : (
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm text-gray-700 mb-3">Attendance Records:</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {clientRecords.map((record) => (
                                      <div
                                        key={record.id}
                                        className="bg-white p-3 rounded border border-gray-200 flex justify-between items-center"
                                      >
                                        <span className="text-sm text-gray-700">
                                          {formatDate(record.date)}
                                        </span>
                                        <span
                                          className={`text-xs px-2 py-1 rounded ${
                                            record.appeared
                                              ? 'bg-green-100 text-green-800'
                                              : 'bg-red-100 text-red-800'
                                          }`}
                                        >
                                          {record.appeared ? 'Present' : 'Absent'}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
