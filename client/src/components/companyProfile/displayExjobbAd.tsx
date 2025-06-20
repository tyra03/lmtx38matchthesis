import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Badge, Row, Col } from "react-bootstrap";

type ExjobbAd = {
  id: number;
  title: string;
  points: number;
  location: string;
  programs: string[];
  numStudents: number;
  imageUrl?: string;
  description: string;
  companyId: number;
};

export default function ExjobbAdCards() {
  const [ads, setAds] = useState<ExjobbAd[]>([]);
  const [current, setCurrent] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [liked, setLiked] = useState<number[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/exjobbads")
      .then(res => setAds(res.data));
  }, []);

  const handleFlip = () => setShowBack(!showBack);

  const handleLike = () => {
    setLiked([...liked, ads[current].id]);
    nextCard();
  };

  const handleX = () => {
    nextCard();
  };

  const handleFavorite = () => {
    setFavorites([...favorites, ads[current].id]);
  };

  const nextCard = () => {
    setShowBack(false);
    setCurrent(curr => (curr + 1 < ads.length ? curr + 1 : 0));
  };

  if (ads.length === 0) return <p className="text-center mt-5">No exjobb ads available.</p>;

  const ad = ads[current];
  return (
    <Row className="justify-content-center mt-5">
      <Col xs={12} md={6}>
        <Card className="shadow-lg" style={{ minHeight: 400, perspective: 1000 }}>
          <div style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${showBack ? 180 : 0}deg)`,
            transition: "transform 0.5s"
          }}>
            {/* Card Front */}
            <div style={{
              backfaceVisibility: "hidden",
              position: "absolute", width: "100%", height: "100%",
              background: "#f8f9fa", borderRadius: "8px"
            }}>
              {ad.imageUrl &&
                <Card.Img variant="top" src={ad.imageUrl} style={{ maxHeight: 180, objectFit: "cover" }} />
              }
              <Card.Body>
                <Card.Title>{ad.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <Badge bg="secondary">{ad.points} hp</Badge> &nbsp;
                  <Badge bg="info">{ad.location}</Badge>
                </Card.Subtitle>
                <Card.Text>
                  <b>Programs:</b> {ad.programs.join(", ")} <br />
                  <b>Number of students:</b> {ad.numStudents}
                </Card.Text>
                <Button variant="outline-dark" size="sm" onClick={handleFlip}>See Details</Button>
              </Card.Body>
            </div>
            {/* Card Back */}
            <div style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              position: "absolute", width: "100%", height: "100%",
              background: "#dee2e6", borderRadius: "8px", padding: "1rem"
            }}>
              <h5>Description</h5>
              <p>{ad.description}</p>
              <Button variant="outline-dark" size="sm" onClick={handleFlip}>Back</Button>
            </div>
          </div>
        </Card>
        <div className="d-flex justify-content-around mt-4">
          <Button variant="light" onClick={handleFavorite} title="Favorite">
            <span role="img" aria-label="star">⭐</span>
          </Button>
          <Button variant="danger" onClick={handleX} title="Nope">
            <span role="img" aria-label="x">❌</span>
          </Button>
          <Button variant="success" onClick={handleLike} title="Like">
            <span role="img" aria-label="heart">❤️</span>
          </Button>
        </div>
      </Col>
    </Row>
  );
}