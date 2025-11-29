import { useLocation, useNavigate } from "react-router-dom";
import mainImg from "../../assets/main-image-classroom.jpg";
import Actions from "../Actions/Actions";
import About from "../About/About";
import Header from "../Header/Header";
import "./Main.css";

const Main = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();

  console.log("Main component - loggedIn:", loggedIn);
  console.log("localStorage teacher:", localStorage.getItem("teacher"));

  return (
    <main className="main-container">
      <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <img
        src={mainImg}
        alt="class of children"
        className="main-image"
      />

      {/* Sign In and Sign Up buttons - Only show when not logged in */}
      {!loggedIn && (
        <div className="auth-buttons-container">
          <button
            onClick={() => navigate("/signin")}
            className="signin-button"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="signup-button"
          >
            Sign Up
          </button>
        </div>
      )}

      <h2 className="main-heading">
        Track client progress!
      </h2>
      <p className="main-description">
        <span>Streamline client assessment, organize</span>
        <span>notes, and gain insights into progress</span>
        <span>patterns with our intuitive teacher</span>
        <span>dashboard.</span>
      </p>

      {/* Debug info - remove after testing */}
      <div className="debug-info">
        <p className="debug-text"></p>
      </div>

      {loggedIn && (
        <div className="action-container">
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
