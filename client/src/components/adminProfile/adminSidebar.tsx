import React from "react";
import { Nav, Card } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "../../css/studentSidebar.css";

const AdminSidebarMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Card className="shadow sidebar-card" style={{ borderRadius: 10, margin: "0 2rem 0 0", minHeight: "400px" }}>
      <Card.Body>
        <Nav className="flex-column" variant="pills">
          <Nav.Link as={NavLink} to="/admin/dashboard">
            📋 Pending Ads
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

export default AdminSidebarMenu;