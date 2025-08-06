import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Alert, Image, Container, Card } from "react-bootstrap";

export default function UploadImage() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "danger"; text: string } | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentImage = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/students/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentImageUrl(res.data.imageUrl || null);
      } catch (err) {
        console.error("Failed to fetch current image");
      }
    };
    fetchCurrentImage();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setMessage({ type: "danger", text: "Please select an image." });
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", image);

    try {
      await axios.post("http://localhost:5000/api/students/me/image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage({ type: "success", text: "Image uploaded successfully!" });
      setCurrentImageUrl(previewUrl); // update on success
    } catch (err) {
      console.error(err);
      setMessage({ type: "danger", text: "Image upload failed." });
    }
  };

  return (
    <Container style={{ maxWidth: 500, margin: "2rem auto" }}>
      <Card className="shadow">
        <Card.Body>
          <h2>Upload Profile Image</h2>
          {message && <Alert variant={message.type}>{message.text}</Alert>}

          <div className="text-center mb-3">
            {currentImageUrl ? (
              <Image src={currentImageUrl} roundedCircle width={140} height={140} />
            ) : (
              <div style={{ width: 140, height: 140, borderRadius: "50%", background: "#ccc", margin: "0 auto" }} />
            )}
          </div>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formImage" className="mb-3">
              <Form.Label>Select a new profile image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Form.Group>

            {previewUrl && (
              <div className="text-center mb-3">
                <p>Preview:</p>
                <Image src={previewUrl} roundedCircle width={140} height={140} />
              </div>
            )}

            <Button type="submit" variant="primary">
              Upload Image
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
