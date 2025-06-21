import React, { useState } from "react";
import StudentSidebarMenu from "./studentSidebar";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";

export default function StudentPage() {
  // Toggle for preview card (state is managed here, passed via Outlet)
  const [showCardPreview, setShowCardPreview] = useState(true);
  const location = useLocation();
  const isDashboard = location.pathname === "/student/dashboard";

  return (
    <Container style={{ maxWidth: "1200px"}}>
      {isDashboard && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Dashboard</h2>
          {/* Button is always rendered; invisible when preview hidden */}
          <Button
            variant="secondary"
            style={{ visibility: "visible" }} // Always visible, but see comment below
            onClick={() => setShowCardPreview((prev) => !prev)}
          >
            {showCardPreview ? "Hide Card Preview" : "Show Card Preview"}
          </Button>
        </div>
      )}
      <Row>
        <Col md={3} className="d-flex justify-content-end align-items-start" style={{ paddingRight: 0 }}>
          <StudentSidebarMenu />
        </Col>
        <Col md={9} className="p-0">
          {/* Pass preview toggle via Outlet context */}
          <Outlet context={{ showCardPreview }} />
        </Col>
      </Row>
    </Container>
  );
}
