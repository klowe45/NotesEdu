import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById } from "../../api/clientsApi";
import { API_URL } from "../../config/api";

const UploadReports = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [behavioralReport, setBehavioralReport] = useState("");
  const [savingReport, setSavingReport] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const clientData = await getClientById(clientId);
        setClient(clientData);
      } catch (err) {
        console.error("Error fetching client:", err);
        setError("Failed to load client data.");
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [clientId]);

  const handleReturn = () => {
    navigate("/behavioral-reports");
  };

  const handleSaveBehavioralReport = async () => {
    if (!behavioralReport.trim()) {
      setError("Please enter a behavioral report before saving");
      return;
    }

    setSavingReport(true);
    setError("");
    setSuccess("");

    try {
      const teacherData = localStorage.getItem("teacher");
      const teacher = teacherData ? JSON.parse(teacherData) : null;
      const authorName = teacher ? `${teacher.first_name} ${teacher.last_name}` : "Unknown";
      const staffId = teacher ? teacher.id : null;

      const response = await fetch(`${API_URL}/behavioral-reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          content: behavioralReport.trim(),
          author: authorName,
          staff_id: staffId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save behavioral report");
      }

      setSuccess("Behavioral report saved successfully!");
      setBehavioralReport("");

      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Save error:", err);
      if (err.message.includes("Failed to fetch")) {
        setError("Cannot connect to server. Please make sure the backend server is running on port 4000.");
      } else {
        setError(err.message || "Failed to save behavioral report. Please try again.");
      }
    } finally {
      setSavingReport(false);
    }
  };

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
              <span className="font-medium">Back to Reports</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="max-w-4xl mx-auto mb-4">
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
        </div>

        {/* Behavioral Report Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Behavioral Report
            </h3>
            {client && (
              <p className="text-gray-600 text-lg mb-4">
                for {client.first_name} {client.middle_name} {client.last_name}
              </p>
            )}
            <textarea
              value={behavioralReport}
              onChange={(e) => setBehavioralReport(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
              placeholder="Enter behavioral observations and notes here..."
              rows={6}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSaveBehavioralReport}
                disabled={savingReport}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {savingReport ? "Saving..." : "Save Behavioral Report"}
              </button>
              <button
                onClick={() => navigate("/behavioral-reports-list")}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View All Reports & Upload Documents
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadReports;
