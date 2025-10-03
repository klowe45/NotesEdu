import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentById, deleteStudentNotes, deleteSpecificNote } from "../utils/FakeStudents";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

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
    "Social Studies"
  ];

  useEffect(() => {
    const foundStudent = getStudentById(parseInt(studentId));
    setStudent(foundStudent);
  }, [studentId]);


  const handleReturn = () => {
    navigate("/students");
  };

  const handleDeleteAllNotes = () => {
    if (window.confirm("Are you sure you want to delete ALL notes? This action cannot be undone.")) {
      deleteStudentNotes(parseInt(studentId));
      // Refresh student data
      const updatedStudent = getStudentById(parseInt(studentId));
      setStudent(updatedStudent);
    }
  };

  const handleDeleteSpecificNote = (noteIndex) => {
    if (window.confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      deleteSpecificNote(parseInt(studentId), noteIndex);
      // Refresh student data
      const updatedStudent = getStudentById(parseInt(studentId));
      setStudent(updatedStudent);
    }
  };

  // Filter notes based on selected category
  const getFilteredNotes = () => {
    if (!student?.notes || !Array.isArray(student.notes)) {
      return student?.notes || [];
    }

    if (!selectedCategoryFilter) {
      return student.notes;
    }

    return student.notes.filter(note => note.category === selectedCategoryFilter);
  };

  if (!student) {
    return (
      <div className="p-4 pb-20">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-gray-600">Student not found</p>
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
              <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Students</span>
            </button>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            {student.firstName} {student.middleName.charAt(0)}. {student.lastName}
          </h1>
          <p className="text-center text-gray-600 text-lg mt-2">
            Grade {student.grade} Dashboard
          </p>
        </div>

        {/* Navigation Bar with Filter */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">Filter Notes by Category:</span>
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
                    Showing: <span className="font-medium text-blue-600">{selectedCategoryFilter}</span>
                  </span>
                )}
                <button
                  onClick={() => setSelectedCategoryFilter("")}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  disabled={!selectedCategoryFilter}
                >
                  Clear Filter
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
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-600">{student.firstName} {student.middleName.charAt(0)}. {student.lastName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Grade:</span>
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Grade {student.grade}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <span className="ml-2 text-gray-600">{new Date(student.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes Card */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Notes</h3>
                {student.notes && Array.isArray(student.notes) && student.notes.length > 0 && (
                  <button
                    onClick={handleDeleteAllNotes}
                    className="flex items-center px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete All
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {(() => {
                  const filteredNotes = getFilteredNotes();
                  return Array.isArray(filteredNotes) && filteredNotes.length > 0 ? (
                    filteredNotes.map((note, index) => {
                      // Find the original index for deletion
                      const originalIndex = student.notes.findIndex(originalNote => originalNote === note);
                      return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          {note.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                              {note.category}
                            </span>
                          )}
                          <p className="text-gray-600 leading-relaxed">{note.content}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(note.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteSpecificNote(originalIndex)}
                          className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          title="Delete this note"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                      );
                    })
                  ) : student.notes && typeof student.notes === 'string' ? (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <p className="text-gray-600 leading-relaxed">{student.notes}</p>
                    </div>
                  ) : selectedCategoryFilter ? (
                    <p className="text-gray-400 italic">No notes found for {selectedCategoryFilter} category.</p>
                  ) : (
                    <p className="text-gray-400 italic">No notes added yet.</p>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;