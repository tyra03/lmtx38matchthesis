import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import CompanySidebarMenu from "./companySidebar";

export default function CompanyPage() {
  return (
    <Container style={{ maxWidth: "1200px" }}>
      <Row>
        <Col md={3} className="d-flex justify-content-end align-items-start" style={{ paddingRight: 0 }}>
          <CompanySidebarMenu />
        </Col>
        <Col md={9} className="p-0">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}