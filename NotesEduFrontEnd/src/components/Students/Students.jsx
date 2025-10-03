import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fakeStudents } from "../utils/FakeStudents";

const Students = () => {
  const navigate = useNavigate();
  const [students] = useState(fakeStudents);

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <div className="p-4 pb-20">
      <div className="container mx-auto">
        {/* Header with Return Button */}
        <div className="mb-8">
          <div className="flex justify-center items-center mb-4">
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
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 text-center">
            Students
          </h2>
        </div>

        {/* Students Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all cursor-pointer active:scale-95 active:shadow-sm"
                onClick={() => navigate(`/student/${student.id}`)}
              >
                {/* Student Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {student.firstName} {student.middleName} {student.lastName}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
