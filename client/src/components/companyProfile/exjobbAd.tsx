import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert } from "react-bootstrap";
import { CHALMERS_PROGRAMS } from "../../chalmersPrograms";

export default function ExjobbAdForm({ companyId }: { companyId: number }) {
  const [form, setForm] = useState({
    title: "",
    points: 30,
    location: "",
    programs: [] as string[],
    numStudents: 1,
    imageUrl: "",
    description: ""
  });
  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProgramsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, o => o.value);
    setForm({ ...form, programs: selected });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      await axios.post("http://localhost:5000/api/exjobbads", { ...form, companyId });
      setMessage({ type: "success", text: "Exjobb ad submitted for review!" });
      setForm({
        title: "", points: 30, location: "", programs: [], numStudents: 1, imageUrl: "", description: ""
      });
    } catch (err: any) {
      setMessage({ type: "danger", text: err?.response?.data?.message || "Failed to create ad" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "2rem auto" }}>
      <h2>Create Exjobb Ad</h2>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control name="title" value={form.title} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Points (hp)</Form.Label>
        <Form.Select name="points" value={form.points} onChange={handleChange}>
          {[15, 30, 60].map(p => <option key={p} value={p}>{p}</option>)}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Location</Form.Label>
        <Form.Control name="location" value={form.location} onChange={handleChange} required />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Educational Programs (hold Ctrl for multiple)</Form.Label>
        <Form.Select name="programs" multiple value={form.programs} onChange={handleProgramsChange}>
          {CHALMERS_PROGRAMS.map(p => <option key={p} value={p}>{p}</option>)}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Number of Students</Form.Label>
        <Form.Control
          type="number" name="numStudents" min={1} max={10} value={form.numStudents} onChange={handleChange} required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Image URL (optional)</Form.Label>
        <Form.Control name="imageUrl" value={form.imageUrl} onChange={handleChange} />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Detailed Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</Button>
    </Form>
  );
}
