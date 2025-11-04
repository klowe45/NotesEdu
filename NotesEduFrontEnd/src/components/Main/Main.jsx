import { useLocation, useNavigate } from "react-router-dom";
import mainImg from "../../assets/main-image-classroom.jpg";
import Actions from "../Actions/Actions";
import About from "../About/About";
import Header from "../Header/Header";

const Main = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();

  console.log("Main component - loggedIn:", loggedIn);
  console.log("localStorage teacher:", localStorage.getItem("teacher"));

  return (
    <main className="flex-1 pb-20">
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <img src={mainImg} alt="class of children" className="rounded-3xl" />
      <h2 className="flex justify-center text-3xl mt-2 mb-2.5">
        Track students progress!
      </h2>
      <p className="flex flex-col items-center justify-center opacity-70 text-lg">
        <span>Streamline student assessment, organize</span>
        <span>notes, and gain insights into learning</span>
        <span>patterns with our intuitive teacher</span>
        <span>dashboard.</span>
      </p>

      {/* Debug info - remove after testing */}
      <div className="text-center my-4">
        <p className="text-sm text-gray-500"></p>
      </div>

      {loggedIn && (
        <div className="action-container flex-auto ">
          <Actions />
        </div>
      )}
      <div>
        <About />
      </div>
      <div></div>
    </main>
  );
};

export default Main;
