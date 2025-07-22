import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import CompanySidebarMenu from "./companySidebar";
import { isJwtValid } from "../../utils/auth";

export default function CompanyPage() {
    const token = localStorage.getItem("token");
    const isAuthenticated = isJwtValid(token);
  return (
    <Container style={{ maxWidth: "1200px" }}>
      <Row>
        {isAuthenticated && (
          <Col md={3} className="d-flex justify-content-end align-items-start" style={{ paddingRight: 0 }}>
            <CompanySidebarMenu />
          </Col>
        )}
        <Col md={isAuthenticated ? 9 : 12} className="p-0">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}