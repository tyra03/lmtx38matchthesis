import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";

export default function EditDescription() {
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/students/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDescription(res.data.description || "");
      } catch (err) {
        setMessage({ type: "danger", text: "Failed to load description." });
      } finally {
        setLoading(false);
      }
    };
    fetchDescription();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/students/me",
        { description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: "success", text: "Description updated successfully!" });
    } catch {
      setMessage({ type: "danger", text: "Failed to update description." });
    }
  };

  if (loading) return <div>Loading description...</div>;

  return (
    <Container style={{ maxWidth: 600, margin: "2rem auto" }}>
      <Card className="shadow">
        <Card.Body>
          <h2 className="mb-4">Edit Your Description</h2>
          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="description">
              <Form.Label>About You</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description about your background, interests, goals, or anything you'd like to share..."
              />
            </Form.Group>

            <Button type="submit" className="mt-3">
              Save Description
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
