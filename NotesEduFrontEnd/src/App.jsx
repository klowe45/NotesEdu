import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import CreateStudent from "./components/CreateStudent/CreateStudent";
import Notes from "./components/Notes/Notes";
import Students from "./components/Students/Students";
import StudentDashboard from "./components/StudentDashboard/StudentDashboard";
import Signup from "./components/Signup/Signup";
import Signin from "./components/Signin/Signin";
import Attendance from "./components/Attendance/Attendance";
import AttendanceHistory from "./components/AttendanceHistory/AttendanceHistory";
import BehavioralReports from "./components/BehavioralReports/BehavioralReports";
import UploadReports from "./components/UploadReports/UploadReports";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if teacher is logged in on mount
  useEffect(() => {
    const teacher = localStorage.getItem("teacher");
    if (teacher) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <div className="relative w-full max-w-[100vw]">
      <div className="mx-auto w-full max-w-screen px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Main loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}></Route>
          <Route path="signup" element={<Signup />}></Route>
          <Route path="signin" element={<Signin setLoggedIn={setLoggedIn} />}></Route>
          <Route path="create-student" element={<CreateStudent />}></Route>
          <Route path="notes" element={<Notes />}></Route>
          <Route path="students" element={<Students />}></Route>
          <Route path="attendance" element={<Attendance />}></Route>
          <Route path="attendance-history" element={<AttendanceHistory />}></Route>
          <Route path="behavioral-reports" element={<BehavioralReports />}></Route>
          <Route path="upload-reports/:studentId" element={<UploadReports />}></Route>
          <Route
            path="student/:studentId"
            element={<StudentDashboard />}
          ></Route>
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
