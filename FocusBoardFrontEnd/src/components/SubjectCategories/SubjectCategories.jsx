import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SubjectCategories = () => {
  const navigate = useNavigate();
  const [categories] = useState([
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
  ]);

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <div className="p-4 pb-20">
      <div className="container mx-auto">
        {/* Header with Return Button */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button
              className="flex items-center px-2 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all duration-200 group"
              onClick={handleReturn}
            >
              <svg
                className="w-4 h-4 mr-1.5 transform group-hover:-translate-x-1 transition-transform duration-200"
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
            Subject Categories
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer hover:bg-gray-50"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {category}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Click to view notes in this category
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCategories;