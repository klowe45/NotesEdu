import { useNavigate } from "react-router-dom";

const Actions = () => {
  const navigate = useNavigate();

  const handleCreateStudentClick = () => {
    navigate("createstudent");
  };

  const handleNotesClick = () => {
    navigate("notes");
  };

  const handleStudentsClick = () => {
    navigate("students");
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2  gap-y-3 justify-center justify-items-center">
      <button
        className="bg-black text-white h-30 w-44 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0 "
        onClick={handleCreateStudentClick}
      >
        Create Student
      </button>
      <button
        className="bg-black text-white h-30 w-44 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0"
        onClick={handleStudentsClick}
      >
        Students
      </button>
      <button className="bg-black text-white h-30 w-44 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0">
        Charts
      </button>
      <button
        className="bg-black text-white h-30 w-44 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0"
        onClick={handleNotesClick}
      >
        Notes
      </button>
    </div>
  );
};

export default Actions;
