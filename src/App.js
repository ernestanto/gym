// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";



import Login from "./components/Login"; // file name and component name match
import Signup from "./components/Signup";
import Password from "./components/Password";
import ProfileImageUploader from "./components/ProfileImageUploader";
import RegistrationForm from "./components/Registrationform";
import CompanyPage from "./components/CompanyPage";
import AllClientsPage from "./components/ClientsPage";
import GymMachines from "./components/GymEquipments";
import DBlist from "./components/DBlist"
import PersonalTrainingClients from "./components/PTclients";
import Healthtracker from "./components/Healthtracker";
import FilteredClients from "./components/Clientsdetailing";
import AttendancePage from "./components/Attendancepage";
import AttendanceReportPage from "./components/Attendacehandler";
import SendWhatsApp from "./components/sendWhatsApp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} /> {/* JSX syntax */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/image" element={<ProfileImageUploader />} />
        <Route path="/password" element={<Password />} />
        <Route path="/form" element={<RegistrationForm />} />
        <Route path="/" element={<CompanyPage/>} />
        <Route path="/clients" element={<AllClientsPage />} />
        <Route path="/gymequipments" element={<GymMachines />} />
        <Route path="/db" element={<DBlist/>} />
        <Route path="/ptclients" element={<PersonalTrainingClients/>}/>
        <Route path="/healthtracker/:clientId" element={<Healthtracker/>}/>
        <Route path="/filteredclients" element={<FilteredClients/>} />
        <Route path="/attendancepage" element={<AttendancePage/>} />
           <Route path="/attendancehandler" element={<AttendanceReportPage/>} />
           <Route path="/sendwhatsapp" element={<SendWhatsApp/>} />

      </Routes>
    </Router>
  );
}

export default App;