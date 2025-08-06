import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainMenuPage from "./components/mainMenu";
import StudentRegisterForm from "./components/studentProfile/studentRegistration";
import StudentLoginForm from "./components/studentProfile/studentLogin";
import CompanyLoginForm from "./components/companyProfile/companyLogin";
import ExjobbAdForm from "./components/companyProfile/exjobbAd";
import ExjobbAdCards from "./components/companyProfile/displayExjobbAd";
import ChangeCompanyPassword from "./components/companyProfile/changePassword";
import CompanyPage from "./components/companyProfile/companyPage";
import StudentDashboard from "./components/studentProfile/studentCard";
import EditDescription from "./components/studentProfile/editDescription";
import EditProfile from "./components/studentProfile/editProfile";
import UploadImage from "./components/studentProfile/uploadImage";
import FavoriteAds from "./components/studentProfile/favorites";
import StudentPage from "./components/studentProfile/studentPage";
import AdminLoginForm from "./components/adminProfile/adminLogin";
import AdminPage from "./components/adminProfile/adminPage";
import AdminDashboard from "./components/adminProfile/adminDashboard";
import CompanyDashboard from "./components/companyProfile/companyDashboard";
import StudentBrowser from "./components/companyProfile/browseStudents";
import MatchedChats from "./components/companyProfile/matchedChats";
import StudentMatchedChats from "./components/studentProfile/matchedChats";

export default function App() {
  return (
    <Router>
      <Routes>
            <Route path="/" element={<MainMenuPage />} />
            <Route path="/student/register" element={<StudentRegisterForm />} />
            <Route path="/student/login" element={<StudentLoginForm />} />
            <Route path="/admin/login" element={<AdminLoginForm />} />
            <Route path="/company/login" element={<CompanyLoginForm />} />

            <Route path="/admin" element={<AdminPage />}>
              <Route path="dashboard" element={<AdminDashboard />} />
            </Route>
            
            <Route path="/company" element={<CompanyPage />}>
              <Route path="dashboard" element={<CompanyDashboard />} />
              <Route path="change-password" element={<ChangeCompanyPassword />} />
              <Route path="exjobbads/create" element={<ExjobbAdForm />} />
              <Route path="students" element={<StudentBrowser />} />
              <Route path="matches" element={<MatchedChats />} />
            </Route>

            <Route path="/student" element={<StudentPage />}> 
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="edit-description" element={<EditDescription />} />
              <Route path="upload-image" element={<UploadImage />} />
              <Route path="favorites" element={<FavoriteAds />} />
              <Route path="exjobbads" element={<ExjobbAdCards />} />
              <Route path="matches" element={<StudentMatchedChats />} />
            </Route>
      </Routes>
    </Router>
  );
}
