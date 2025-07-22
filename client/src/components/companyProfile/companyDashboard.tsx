import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function CompanyDashboard() {
  return (
    <Card className="shadow" style={{ maxWidth: 400, margin: "2rem auto", padding: "1rem" }}>
      <h3 className="mb-3">Company Dashboard</h3>
      <Button as={Link} to="/company/change-password" className="mb-2">
        Change Password
      </Button>
      <Button
        as={Link}
        to="/company/exjobbads/create"
        variant="secondary"
      >
        Manage Ads
      </Button>
    </Card>
  );
}