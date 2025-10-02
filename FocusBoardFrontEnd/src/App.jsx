import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import CreateClient from "./components/CreateClient/CreateClient";
import Notes from "./components/Notes/Notes";
import Clients from "./components/Clients/Clients";
import ClientDashboard from "./components/ClientDashboard/ClientDashboard";

function App() {
  return (
    <div className="relative w-full max-w-[100vw]">
      <div className="mx-auto w-full max-w-screen px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="createclient" element={<CreateClient />}></Route>
          <Route path="notes" element={<Notes />}></Route>
          <Route path="clients" element={<Clients />}></Route>
          <Route path="client/:clientId" element={<ClientDashboard />}></Route>
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
