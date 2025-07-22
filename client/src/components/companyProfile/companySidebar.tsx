import React from "react";
import { Nav, Card } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "../../css/studentSidebar.css";

const CompanySidebarMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Card className="shadow sidebar-card" style={{ borderRadius: 10, margin: "0 2rem 0 0", minHeight: "400px" }}>
      <Card.Body>
        <Nav className="flex-column" variant="pills">
          <Nav.Link as={NavLink} to="/company/dashboard">
            🏠 Dashboard
          </Nav.Link>
          <Nav.Link as={NavLink} to="/company/change-password">
            🔒 Change Password
          </Nav.Link>
          <Nav.Link as={NavLink} to="/company/exjobbads/create">
            📢 Manage Ads
          </Nav.Link>
        </Nav>
        <div className="mt-4">
          <Nav className="flex-column">
            <Nav.Link as="button" onClick={handleLogout} style={{ color: "#d9534f" }}>
              🚪 Log Out
            </Nav.Link>
          </Nav>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CompanySidebarMenu;