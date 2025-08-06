import { Nav, Card } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "../../css/studentSidebar.css"; // You can extend or override with more styles

const StudentSidebarMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Card className="shadow sidebar-card" style={{ borderRadius: 10, margin: "0 2rem 0 0", minHeight: "400px" }}>
      <Card.Body>
        <Nav className="flex-column" variant="pills">
          <Nav.Link as={NavLink} to="/student/dashboard">
            🏠 Dashboard
          </Nav.Link>
          <Nav.Link as={NavLink} to="/student/exjobbads">
            🆕 Browse New Ads
          </Nav.Link>
          <Nav.Link as={NavLink} to="/student/favorites">
            ⭐ Favorited Exjobb Ads
          </Nav.Link>
          <Nav.Link as={NavLink} to="/student/matches">
            💬 Conversations
          </Nav.Link>
        </Nav>
        <div className="mt-4">
          <Nav className="flex-column">
            <Nav.Link as="button" onClick={handleLogout} style={{ color: "#d9534f"}}>
              🚪 Log Out
            </Nav.Link>
          </Nav>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StudentSidebarMenu;
