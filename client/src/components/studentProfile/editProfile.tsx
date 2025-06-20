import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Spinner, Card } from "react-bootstrap";

function EditProfile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    program: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/students/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          program: res.data.program || "",
        });
      } catch (err) {
        setMessage({ type: "danger", text: "Failed to load profile information." });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/students/me", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "danger", text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Card className="shadow">
      <Card.Body>
        <h3 className="mb-4">Edit Profile Info</h3>
        {message && <Alert variant={message.type}>{message.text}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Program of Study</Form.Label>
            <Form.Control
              name="program"
              value={formData.program}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" variant="primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
export default EditProfile;
