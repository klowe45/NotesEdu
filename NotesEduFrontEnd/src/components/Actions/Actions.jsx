import { useNavigate } from "react-router-dom";

const Actions = () => {
  const navigate = useNavigate();

  const handleCreateStudentClick = () => {
    navigate("create-student");
  };

  const handleNotesClick = () => {
    navigate("notes");
  };

  const handleStudentsClick = () => {
    navigate("students");
  };

  const handleAttendanceClick = () => {
    navigate("attendance");
  };

  const handleReportsClick = () => {
    navigate("behavioral-reports");
  };

  const handleDailiesClick = () => {
    navigate("dailies");
  };

  return (
    <div className="grid grid-cols-2 gap-3 justify-center justify-items-center">
      <button
        className="bg-black text-white h-30 w-44 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0 "
        onClick={handleCreateStudentClick}
      >
        Create Client
      </button>
      <button
        className="bg-black text-white h-30 w-44 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0"
        onClick={handleStudentsClick}
      >
        Clients
      </button>
      <button
        className="bg-black text-white h-30 w-44 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0"
        onClick={handleAttendanceClick}
      >
        Attendance
      </button>
      <button
        className="bg-black text-white h-30 w-44 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0"
        onClick={handleNotesClick}
      >
        Notes
      </button>
      <button
        className="bg-black text-white h-30 w-44 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0"
        onClick={handleReportsClick}
      >
        Reports
      </button>
      <button
        className="bg-black text-white h-30 w-44 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0"
        onClick={handleDailiesClick}
      >
        Dailies
      </button>
    </div>
  );
};

export default Actions;
