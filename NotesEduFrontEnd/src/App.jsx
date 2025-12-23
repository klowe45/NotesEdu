import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import CreateStudent from "./components/CreateStudent/CreateStudent";
import Notes from "./components/Notes/Notes";
import Students from "./components/Students/Students";
import StudentDashboard from "./components/StudentDashboard/StudentDashboard";
import ClientNotes from "./components/ClientNotes/ClientNotes";
import ClientDailies from "./components/ClientDailies/ClientDailies";
import Charts from "./components/Charts/Charts";
import Medication from "./components/Medication/Medication";
import BasicInformation from "./components/BasicInformation/BasicInformation";
import Signup from "./components/Signup/Signup";
import Signin from "./components/Signin/Signin";
import OrganizationSignin from "./components/OrganizationSignin/OrganizationSignin";
import Attendance from "./components/Attendance/Attendance";
import AttendanceHistory from "./components/AttendanceHistory/AttendanceHistory";
import BehavioralReports from "./components/BehavioralReports/BehavioralReports";
import UploadReports from "./components/UploadReports/UploadReports";
import Dailies from "./components/Dailies/Dailies";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // Check if teacher or organization is logged in on mount
  useEffect(() => {
    const teacher = localStorage.getItem("teacher");
    const organization = localStorage.getItem("organization");
    if (teacher || organization) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <div className="relative w-full max-w-[100vw] overflow-x-hidden">
      <div className="mx-auto w-full max-w-screen px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Main loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}></Route>
          <Route path="signup" element={<Signup />}></Route>
          <Route path="signin" element={<Signin setLoggedIn={setLoggedIn} />}></Route>
          <Route path="organization/signin" element={<OrganizationSignin setLoggedIn={setLoggedIn} />}></Route>
          <Route path="create-client" element={<CreateStudent />}></Route>
          <Route path="notes" element={<Notes />}></Route>
          <Route path="clients" element={<Students />}></Route>
          <Route path="attendance" element={<Attendance />}></Route>
          <Route path="attendance-history" element={<AttendanceHistory />}></Route>
          <Route path="behavioral-reports" element={<BehavioralReports />}></Route>
          <Route path="upload-reports/:clientId" element={<UploadReports />}></Route>
          <Route path="dailies" element={<Dailies />}></Route>
          <Route
            path="client/:clientId"
            element={<StudentDashboard />}
          ></Route>
          <Route
            path="client/:clientId/notes"
            element={<ClientNotes />}
          ></Route>
          <Route
            path="client/:clientId/dailies"
            element={<ClientDailies />}
          ></Route>
          <Route
            path="client/:clientId/charts"
            element={<Charts />}
          ></Route>
          <Route
            path="client/:clientId/medication"
            element={<Medication />}
          ></Route>
          <Route
            path="client/:clientId/basic-information"
            element={<BasicInformation />}
          ></Route>
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
