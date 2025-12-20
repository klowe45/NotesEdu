import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClientById } from "../../api/clientsApi";
import { saveMedication, getMedicationByClient } from "../../api/medicationApi";

const Medication = () => {
  const navigate = useNavigate();
  const { clientId } = useParams();
  const [client, setClient] = useState(null);
  const [medicationText, setMedicationText] = useState("");
  const [medications, setMedications] = useState([
    { id: 1, name: "", notes: "" },
  ]);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState(null);

  useEffect(() => {
    const fetchClientAndMedication = async () => {
      try {
        const clientData = await getClientById(clientId);
        setClient(clientData);

        // Fetch existing medication data
        const medicationData = await getMedicationByClient(clientId);
        if (medicationData.length > 0) {
          // Get general notes from first record
          setMedicationText(medicationData[0].general_notes || "");

          // Map medication records to table rows
          const medRows = medicationData.map((med) => ({
            id: med.id,
            name: med.medication_name || "",
            notes: med.medication_notes || "",
          }));
          setMedications(medRows);
          setIsEditing(false); // Set to read-only when loading existing data
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchClientAndMedication();
  }, [clientId]);

  const handleBack = () => {
    navigate(`/client/${clientId}`);
  };

  const addMedicationRow = () => {
    setMedications([
      ...medications,
      { id: Date.now(), name: "", notes: "" },
    ]);
  };

  const handleDeleteClick = (id) => {
    setMedicationToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (medicationToDelete) {
      setMedications(medications.filter((med) => med.id !== medicationToDelete));
    }
    setShowDeleteModal(false);
    setMedicationToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMedicationToDelete(null);
  };

  const updateMedication = (id, field, value) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage("");

      // Get teacher from localStorage
      const teacherData = localStorage.getItem("teacher");
      const teacher = teacherData ? JSON.parse(teacherData) : null;

      if (!teacher) {
        setSaveMessage("Error: No teacher logged in");
        setSaving(false);
        return;
      }

      // Prepare medication data
      const medicationData = {
        client_id: clientId,
        teacher_id: teacher.id,
        general_notes: medicationText,
        medications: medications.map((med) => ({
          name: med.name,
          notes: med.notes,
        })),
      };

      await saveMedication(medicationData);
      setSaveMessage("Medication saved successfully!");
      setIsEditing(false); // Exit edit mode after saving

      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error("Error saving medication:", err);
      setSaveMessage("Error saving medication");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 pb-20">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-start">
              <button
                className="flex items-center px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                onClick={handleBack}
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
            </div>
            <div className="flex-1 text-center">
              <h1 className="text-4xl font-bold text-gray-900">Medication</h1>
              {client && (
                <p className="text-xl text-gray-600 mt-2">
                  {client.first_name}{" "}
                  {client.middle_name ? `${client.middle_name.charAt(0)}. ` : ""}
                  {client.last_name}
                </p>
              )}
            </div>
            <div className="flex-1 flex justify-end">
              <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                  />
                </svg>
                {saving ? "Saving..." : "Save"}
              </button>
              </div>
            </div>
          </div>

          {saveMessage && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                saveMessage.includes("Error")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {saveMessage}
            </div>
          )}
        </div>

        {/* Medication Text Box */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
          <textarea
            value={medicationText}
            onChange={(e) => setMedicationText(e.target.value)}
            readOnly={!isEditing}
            placeholder="Enter information..."
            className={`w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
              !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
            }`}
          />
        </div>

        {/* Medication Table */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Medication List
            </h2>
            <button
              onClick={addMedicationRow}
              disabled={!isEditing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Medication
            </button>
          </div>

          <div className="overflow-visible">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Medication
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                    Notes
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700 w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {medications.map((med) => (
                  <tr key={med.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) =>
                          updateMedication(med.id, "name", e.target.value)
                        }
                        readOnly={!isEditing}
                        placeholder="Enter medication name"
                        className={`w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <input
                        type="text"
                        value={med.notes}
                        onChange={(e) =>
                          updateMedication(med.id, "notes", e.target.value)
                        }
                        readOnly={!isEditing}
                        placeholder="Enter notes"
                        className={`w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      <button
                        onClick={() => handleDeleteClick(med.id)}
                        disabled={!isEditing}
                        className="text-red-600 hover:text-red-800 transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                        title="Delete medication"
                      >
                        <svg
                          className="w-5 h-5 mx-auto"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this medication and its notes?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Medication;
