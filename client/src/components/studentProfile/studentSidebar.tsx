import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

import "../../css/sidebarMenu.css"; // (Optional: style it as you like)

const StudentSidebarMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Or wherever your login/landing page is
  };

  return (
    <div className="sidebar-menu d-flex flex-column justify-content-between" style={{height: "100vh"}}>
      <div>
        <Nav className="flex-column" variant="pills">
          <Nav.Link as={NavLink} to="/student/favorites">
            ⭐ Favorited Exjobb Ads
          </Nav.Link>
          <Nav.Link as={NavLink} to="/student/exjobbads">
            🆕 Browse New Ads
          </Nav.Link>
        </Nav>
      </div>
      <div className="mb-4">
        <Nav className="flex-column">
          <Nav.Link as="button" onClick={handleLogout} style={{color: "#d9534f", fontWeight: "bold"}}>
            🚪 Log Out
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
};

export default StudentSidebarMenu;
