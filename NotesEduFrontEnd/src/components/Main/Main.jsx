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
    <main className="flex-1 pb-20 sm:pb-16 md:pb-12 lg:pb-4 px-4 sm:px-6 md:px-8">
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <img
        src={mainImg}
        alt="class of children"
        className="rounded-xl sm:rounded-2xl lg:rounded-3xl w-full sm:max-w-xl md:max-w-2xl lg:max-w-2xl mx-auto"
      />

      {/* Sign In and Sign Up buttons - Only show when not logged in */}
      {!loggedIn && (
        <div className="flex justify-center gap-3 sm:gap-4 mt-4 mb-3 sm:mt-5 sm:mb-3 md:mt-6 md:mb-4 lg:mt-3 lg:mb-2">
          <button
            onClick={() => navigate("/signin")}
            className="px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 lg:px-6 lg:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base md:text-lg lg:text-base"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 lg:px-6 lg:py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base md:text-lg lg:text-base"
          >
            Sign Up
          </button>
        </div>
      )}

      <h2 className="flex justify-center text-2xl sm:text-2xl md:text-3xl lg:text-2xl mt-3 mb-2 sm:mt-3 sm:mb-2 md:mt-2 md:mb-2.5 lg:mt-1 lg:mb-1 font-bold">
        Track client progress!
      </h2>
      <p className="flex flex-col items-center justify-center opacity-70 text-sm sm:text-base md:text-lg lg:text-base px-4">
        <span>Streamline client assessment, organize</span>
        <span>notes, and gain insights into progress</span>
        <span>patterns with our intuitive teacher</span>
        <span>dashboard.</span>
      </p>

      {/* Debug info - remove after testing */}
      <div className="text-center my-4 lg:my-1">
        <p className="text-sm text-gray-500"></p>
      </div>

      {loggedIn && (
        <div className="action-container flex-auto">
          <Actions />
        </div>
      )}
      <div className="lg:mt-2">
        <About />
      </div>
      <div></div>
    </main>
  );
};

export default Main;
