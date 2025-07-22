import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Card } from "react-bootstrap";

export default function ChangeCompanyPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "http://localhost:5000/api/companies/me/password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: "success", text: "Password updated successfully" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setMessage({ type: "danger", text: err?.response?.data?.message || "Failed to update password" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="shadow" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <Card.Body>
        <h3 className="mb-3">Change Password</h3>
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Change Password"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}