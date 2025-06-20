import React from "react";
import { Row, Col, Nav } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";

export default function StudentPage() {
  return (
    <Row style={{ minHeight: "100vh" }}>
      <Col md={3} className="bg-light p-0" style={{ borderRight: "1px solid #eee" }}>
        <Nav className="flex-column" variant="pills">
          <Nav.Link as={NavLink} to="/student/dashboard" end>
            Dashboard
          </Nav.Link>
          <Nav.Link as={NavLink} to="/student/exjobbads">
            Exjobb Ads
          </Nav.Link>
          {/* Add more links here */}
        </Nav>
      </Col>
      <Col md={9} className="p-4">
        <Outlet />
      </Col>
    </Row>
  );
}
