import { useLocation, useNavigate } from "react-router-dom";
import mainImg from "../../assets/main-image-classroom.jpg";
import Actions from "../Actions/Actions";
import About from "../About/About";
import Header from "../Header/Header";

const Main = () => {
  return (
    <main className="flex-1 pb-20">
      <Header />
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
      <button className="w-[100%] mt-[10px] mb-[10px] px-6 py-3 bg-blue-600 text-white border-0 rounded-md text-lg cursor-pointer hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
        Sign In
      </button>
      <div className="action-container flex-auto ">
        <Actions />
      </div>
      <div>
        <About />
      </div>
      <div></div>
    </main>
  );
};

export default Main;
