import { useNavigate } from "react-router-dom";

const Actions = () => {
  const navigate = useNavigate();

  const handleCreateClientClick = () => {
    navigate("create-client");
  };

  const handleNotesClick = () => {
    navigate("notes");
  };

  const handleClientsClick = () => {
    navigate("clients");
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
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-4 lg:gap-2 justify-center justify-items-center mt-3 sm:mt-4 md:mt-5 lg:mt-2">
      <button
        className="bg-black text-white h-28 w-40 sm:h-32 sm:w-48 md:h-36 md:w-52 lg:h-20 lg:w-36 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0 text-sm sm:text-base md:text-lg lg:text-sm font-medium"
        onClick={handleCreateClientClick}
      >
        Create Client
      </button>
      <button
        className="bg-black text-white h-28 w-40 sm:h-32 sm:w-48 md:h-36 md:w-52 lg:h-20 lg:w-36 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0 text-sm sm:text-base md:text-lg lg:text-sm font-medium"
        onClick={handleClientsClick}
      >
        Clients
      </button>
      <button
        className="bg-black text-white h-28 w-40 sm:h-32 sm:w-48 md:h-36 md:w-52 lg:h-20 lg:w-36 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0 text-sm sm:text-base md:text-lg lg:text-sm font-medium"
        onClick={handleAttendanceClick}
      >
        Attendance
      </button>
      <button
        className="bg-black text-white h-28 w-40 sm:h-32 sm:w-48 md:h-36 md:w-52 lg:h-20 lg:w-36 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0 text-sm sm:text-base md:text-lg lg:text-sm font-medium"
        onClick={handleNotesClick}
      >
        Notes
      </button>
      <button
        className="bg-black text-white h-28 w-40 sm:h-32 sm:w-48 md:h-36 md:w-52 lg:h-20 lg:w-36 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0 text-sm sm:text-base md:text-lg lg:text-sm font-medium"
        onClick={handleReportsClick}
      >
        Reports
      </button>
      <button
        className="bg-black text-white h-28 w-40 sm:h-32 sm:w-48 md:h-36 md:w-52 lg:h-20 lg:w-36 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0 text-sm sm:text-base md:text-lg lg:text-sm font-medium"
        onClick={handleDailiesClick}
      >
        Dailies
      </button>
    </div>
  );
};

export default Actions;
