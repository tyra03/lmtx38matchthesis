import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function StudentLoginForm() {
  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "danger" | "success"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      const res = await axios.post("http://localhost:5000/api/students/login", {
        identifier,
        password,
      });
      setMessage({ type: "success", text: "Login successful!" });
      localStorage.setItem("token", res.data.token);
      navigate("/student/dashboard");
    } catch (err: any) {
      setMessage({
        type: "danger",
        text: err?.response?.data?.message || "Login failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Student Login</h2>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      <Form.Group controlId="identifier" className="mb-3">
        <Form.Label>Email or Phone</Form.Label>
        <Form.Control
          name="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="password" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Logging in..." : "Log In"}
      </Button>

      <Button variant="secondary" type="button"
        onClick={() => navigate("/")}>Back
      </Button>
    </Form>
  );
}
