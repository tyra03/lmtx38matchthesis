import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/mainMenu.css";
import "../css/main.css";
import logo from "../assets/logo.png"; // Import the logo

export default function MainMenuPage() {
  const navigate = useNavigate();

  return (
    <div className="main-menu-wrapper">
      {/* Logo in top left corner */}
      <img
        src={logo}
        alt="MatchThesis Logo"
        className="matchthesis-logo"
      />

      <Container className="py-5">
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={8} lg={6}>
            <h1 className="text-center mb-4" style={{ fontWeight: 700, letterSpacing: 2 }}>
              Welcome to MatchThesis
            </h1>
            <p className="text-center text-light mb-5">
              Please select your role to continue
            </p>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} md={4} className="mb-4">
            <Card bg="dark" text="light" className="shadow-lg">
              <Card.Body>
                <Card.Title>Student</Card.Title>
                <Card.Text>
                  Find and apply to exciting thesis projects at Chalmers. Register a new student account or log in to access your dashboard.
                </Card.Text>
                <Button
                  variant="outline-light"
                  className="w-100 mb-2"
                  onClick={() => navigate("/student/register")}
                >
                  Register as Student
                </Button>
                <Button
                  variant="secondary"
                  className="w-100"
                  onClick={() => navigate("/student/login")}
                >
                  Log in as Student
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4} className="mb-4">
            <Card bg="secondary" text="light" className="shadow-lg">
              <Card.Body>
                <Card.Title>Company</Card.Title>
                <Card.Text>
                  Submit thesis ads for students, or log in to manage your ads and view matched students (after approval).
                </Card.Text>
                <Button
                  variant="outline-light"
                  className="w-100 mb-2"
                  onClick={() => navigate("/company/exjobbads/create")}
                >
                  Create Exjobb Ad
                </Button>
                <Button
                  variant="outline-light"
                  className="w-100 mb-2"
                  onClick={() => navigate("/company/register")}
                >
                  Register as Company
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4} className="mb-4">
            <Card bg="light" text="dark" className="shadow-lg">
              <Card.Body>
                <Card.Title>Admin</Card.Title>
                <Card.Text>
                  Review, accept, or reject company exjobb ads.
                </Card.Text>
                <Button
                  variant="outline-dark"
                  className="w-100"
                  onClick={() => navigate("/admin/login")}
                >
                  Admin Login
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
