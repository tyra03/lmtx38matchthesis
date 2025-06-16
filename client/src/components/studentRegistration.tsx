import React, { useState } from "react";
import axios from "axios";
import { CHALMERS_PROGRAMS } from "../chalmersPrograms";
import { Form, Button, Alert } from "react-bootstrap";

type FormState = {
  name: string;
  phone: string;
  email: string;
  program: string;
  password: string;
};

export default function StudentRegisterForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    program: CHALMERS_PROGRAMS[0],
    password: "",
  });

  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Each handler is explicit and typesafe
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, name: e.target.value });
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, phone: e.target.value });
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, email: e.target.value });
  };
  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({ ...form, program: e.target.value });
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, password: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSubmitting(true);
    try {
      await axios.post("http://localhost:5000/api/students", form);
      setMessage({ type: "success", text: "Account created!" });
      setForm({ name: "", phone: "", email: "", program: CHALMERS_PROGRAMS[0], password: "" });
    } catch (err: any) {
      setMessage({
        type: "danger",
        text: err?.response?.data?.message || "Registration failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Register as Student</h2>
      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Form.Group controlId="name" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          name="name"
          value={form.name}
          onChange={handleNameChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="phone" className="mb-3">
        <Form.Label>Phone (unique)</Form.Label>
        <Form.Control
          name="phone"
          value={form.phone}
          onChange={handlePhoneChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={form.email}
          onChange={handleEmailChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="program" className="mb-3">
        <Form.Label>Educational Program</Form.Label>
        <Form.Select
          name="program"
          value={form.program}
          onChange={handleProgramChange}
        >
          {CHALMERS_PROGRAMS.map(program => (
            <option key={program} value={program}>{program}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="password" className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          name="password"
          value={form.password}
          onChange={handlePasswordChange}
          required
        />
      </Form.Group>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Registering..." : "Register"}
      </Button>
    </Form>
  );
}
