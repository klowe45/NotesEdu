import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const [teacher, setTeacher] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get teacher from localStorage
    const teacherData = localStorage.getItem("teacher");
    if (teacherData) {
      try {
        setTeacher(JSON.parse(teacherData));
      } catch (err) {
        console.error("Error parsing teacher data:", err);
      }
    }
  }, []);

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full mt-auto py-2.5 bg-gray-100 border-t border-gray-300">
      <div className="flex justify-between items-center px-6">
        {teacher ? (
          <p className="m-0 text-gray-600">
            Welcome{" "}
            <span className="font-medium">
              {teacher.first_name} {teacher.last_name}
            </span>
          </p>
        ) : (
          <p className="m-0 text-gray-600">NotesEdu</p>
        )}
        <div className="flex items-center gap-4">
          <button
            onClick={handleHomeClick}
            style={{ backgroundColor: 'transparent' }}
            className="flex items-center gap-2 px-3 py-1.5 text-black border-0 rounded-lg transition-all duration-200"
            title="Go to home"
          >
            <svg
              className="w-5 h-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-sm font-medium text-black">Home</span>
          </button>
          <p className="m-0 text-gray-600">NotesEdu</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
