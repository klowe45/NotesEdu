import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import CreateStudent from "./components/CreateStudent/CreateStudent";
import Notes from "./components/Notes/Notes";
import Students from "./components/Students/Students";
import StudentDashboard from "./components/StudentDashboard/StudentDashboard";

function App() {
  return (
    <div className="relative w-full max-w-[100vw]">
      <div className="mx-auto w-full max-w-screen px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="createstudent" element={<CreateStudent />}></Route>
          <Route path="notes" element={<Notes />}></Route>
          <Route path="students" element={<Students />}></Route>
          <Route path="student/:studentId" element={<StudentDashboard />}></Route>
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
