import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FormSample from "../FormSample/FormSample";

const CreateStudent = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [grade, setGrade] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const createdStudentData = {
      firstName: firstName,
      lastName: lastName,

      createdAt: new Date().toISOString(),
    };

    console.log("Created Student Data:", createdStudentData);

    navigate("/");
  };

  const handleReturn = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white-50 p-4 pb-20">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            className="flex items-center px-3 py-2 text-white hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
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
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create New Student
          </h1>
          <p className="text-lg text-gray-600">
            Add a new student to your dashboard
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-2xl mx-auto">
        <FormSample
          title="Student Information"
          submitText="Create Student"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  id="firstname"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  id="lastname"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
          </div>
        </FormSample>
      </div>
    </div>
  );
};

export default CreateStudent;
