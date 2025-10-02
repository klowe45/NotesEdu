import { useNavigate } from "react-router-dom";

const Actions = () => {
  const navigate = useNavigate();

  const handleCreateClientClick = () => {
    navigate("createclient");
  };

  const handleNotesClick = () => {
    navigate("notes");
  };

  const handleClientsClick = () => {
    navigate("clients");
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2  gap-y-3 justify-center justify-items-center">
      <button
        className="bg-black text-white h-30 w-44 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0 "
        onClick={handleCreateClientClick}
      >
        Create Client
      </button>
      <button
        className="bg-black text-white h-30 w-44 rounded hover:bg-gray-800 transition-colors cursor-pointer border-0"
        onClick={handleClientsClick}
      >
        Clients
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
