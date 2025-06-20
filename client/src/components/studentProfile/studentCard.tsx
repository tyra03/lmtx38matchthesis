import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import ProfileCard from "./previewCard";
import "../../css/cardImageNonPreview.css";

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState<{
    type: "danger" | "success";
    text: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCardPreview, setShowCardPreview] = useState(true);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/students/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setDescription(res.data.description || "");
      } catch {
        setMessage({
          type: "danger",
          text: "Failed to load profile info.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Auto-dismiss alert message after 3 seconds
  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  // Handle profile save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");

      // Update description
      await axios.put(
        "http://localhost:5000/api/students/me",
        { description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Upload image if selected
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        await axios.post("http://localhost:5000/api/students/me/image", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Refresh profile
      const updated = await axios.get("http://localhost:5000/api/students/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(updated.data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch {
      setMessage({ type: "danger", text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  };

  // Handle file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0] || null);
  };

  if (loading) return <Spinner animation="border" className="m-4" />;

  return (
    <Container style={{ maxWidth: "1000px", margin: "2rem auto" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Dashboard</h2>
        <Button
          variant="secondary"
          onClick={() => setShowCardPreview((prev) => !prev)}
        >
          {showCardPreview ? "Hide Card Preview" : "Show Card Preview"}
        </Button>
      </div>

      {/* Alert message, auto-dismisses */}
      {message && <Alert variant={message.type}>{message.text}</Alert>}

      <Row>
        {/* Left: Form */}
        <Col md={showCardPreview ? 7 : 12}>
          <Card className="shadow">
            <Card.Body>
              <Form onSubmit={handleSave}>
                <Row className="mb-4">
                  <Col md={5} className="text-center">
                    <div className="image-preview-frame">
                      {profile.imageUrl ? (
                        <img
                          src={`http://localhost:5000${profile.imageUrl}`}
                          alt="Profile"
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            background: "#eee",
                          }}
                        />
                      )}
                    </div>

                    <Form.Group controlId="formImage" className="mt-3">
                      <Form.Label>Upload a new profile image</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={7}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control value={profile.name || ""} readOnly disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control value={profile.email || ""} readOnly disabled />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Program</Form.Label>
                      <Form.Control value={profile.program || ""} readOnly disabled />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Describe yourself</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write something about your goals, interests, or experience..."
                  />
                </Form.Group>

                <Button type="submit" variant="secondary" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Right: Card preview */}
        {showCardPreview && (
          <Col md={5}>
            <Card className="shadow">
              <Card.Body>
                <h5 className="text-center mb-3">Profile Card Preview</h5>
                <div className="d-flex justify-content-center">
                  <ProfileCard
                    name={profile.name}
                    program={profile.program}
                    imageUrl={`http://localhost:5000${profile.imageUrl || ""}`}
                    description={description}
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}
