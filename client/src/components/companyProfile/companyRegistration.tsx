import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../css/studentRegistration.css";

type FormState = {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  password: string;
};

export default function CompanyRegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    companyName: "",
    password: "",
  });
  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/companies/register", form);
      setMessage({ type: "success", text: "Account created!" });
      setForm({ name: "", phone: "", email: "", companyName: "", password: "" });
    } catch (err: any) {
      setMessage({ type: "danger", text: err?.response?.data?.message || "Registration failed" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Register as Company</h2>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      <Form.Group controlId="name" className="mb-3">
        <Form.Label>Contact Name</Form.Label>
        <Form.Control name="name" value={form.name} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="phone" className="mb-3">
        <Form.Label>Phone (unique)</Form.Label>
        <Form.Control name="phone" value={form.phone} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="companyName" className="mb-3">
        <Form.Label>Company Name</Form.Label>
        <Form.Control name="companyName" value={form.companyName} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="password" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
      </Form.Group>
      <Button type="submit" disabled={submitting} className="me-2">
        {submitting ? "Registering..." : "Register"}
      </Button>
      <Button variant="secondary" type="button" onClick={() => navigate("/")}>Back</Button>
    </Form>
  );
}