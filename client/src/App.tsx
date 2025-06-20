import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenuPage from "./components/mainMenu";
import StudentRegisterForm from "./components/studentProfile/studentRegistration";
import StudentLoginForm from "./components/studentProfile/studentLogin";
import ExjobbAdForm from "./components/companyProfile/exjobbAd";
import ExjobbAdCards from "./components/companyProfile/displayExjobbAd";
import StudentDashboard from "./components/studentProfile/studentCard";
import EditDescription from "./components/studentProfile/editDescription";
import EditProfile from "./components/studentProfile/editDescription";
import UploadImage from "./components/studentProfile/uploadImage";
import StudentPage from "./components/studentProfile/studentPage";
// ... import other forms as you build them

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/student" element={<StudentPage />} />
        <Route path="/" element={<MainMenuPage />} />
        <Route path="/student/register" element={<StudentRegisterForm />} />
        <Route path="/student/login" element={<StudentLoginForm />} />
        <Route path="/company/exjobbads/create" element={<ExjobbAdForm companyId={/*get from auth context or user*/ 1} />} />
        <Route path="/student/exjobbads" element={<ExjobbAdCards />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/edit-profile" element={<EditProfile />} />
        <Route path="/student/edit-description" element={<EditDescription />} />
        <Route path="/student/upload-image" element={<UploadImage />} />
      </Routes>
    </Router>
  );
}
