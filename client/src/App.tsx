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
import AdminLoginForm from "./components/adminProfile/adminLogin";
import AdminPage from "./components/adminProfile/adminPage";
import AdminDashboard from "./components/adminProfile/adminDashboard";

export default function App() {
  return (
    <Router>
  <Routes>
      <Route path="/" element={<MainMenuPage />} />
      <Route path="/student/register" element={<StudentRegisterForm />} />
      <Route path="/student/login" element={<StudentLoginForm />} />
      <Route path="/admin/login" element={<AdminLoginForm />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="/company/exjobbads/create" element={<ExjobbAdForm companyId={1} />} />
      <Route path="/student" element={<StudentPage />}>
      <Route path="dashboard" element={<StudentDashboard />} />
      <Route path="edit-profile" element={<EditProfile />} />
      <Route path="edit-description" element={<EditDescription />} />
      <Route path="upload-image" element={<UploadImage />} />
      <Route path="exjobbads" element={<ExjobbAdCards />} />
    </Route>
  </Routes>
</Router>
  );
}
