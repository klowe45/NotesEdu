import { useNavigate } from "react-router-dom";
import "./Actions.css";

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
    <div className="actions-grid">
      <button
        className="action-button"
        onClick={handleCreateClientClick}
      >
        Create Client
      </button>
      <button
        className="action-button"
        onClick={handleClientsClick}
      >
        Clients
      </button>
      <button
        className="action-button"
        onClick={handleAttendanceClick}
      >
        Attendance
      </button>
      <button
        className="action-button"
        onClick={handleNotesClick}
      >
        Notes
      </button>
      <button
        className="action-button"
        onClick={handleReportsClick}
      >
        Reports
      </button>
      <button
        className="action-button"
        onClick={handleDailiesClick}
      >
        Dailies
      </button>
    </div>
  );
};

export default Actions;
