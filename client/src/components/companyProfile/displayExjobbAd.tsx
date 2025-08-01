import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Badge, Row, Col } from "react-bootstrap";
import "../../css/exjobbCard.css";

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
  const [favorites, setFavorites] = useState<number[]>([]);
  const [liked, setLiked] = useState<number[]>([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/exjobbads")
      .then(res => setAds(res.data));
  }, []);

  const recordAction = async (type: "like" | "dislike" | "favorite") => {
    const token = localStorage.getItem("token");
    const adId = ads[current].id;
    try {
      await axios.post(
        "http://localhost:5000/api/exjobbads/actions",
        { adId, type },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
    } catch (err) {
      console.error("Failed to record action", err);
    }
  };

  const handleLike = async () => {
    setLiked([...liked, ads[current].id]);
    await recordAction("like");
    nextCard();
  };

  const handleX = async () => {
    await recordAction("dislike");
    nextCard();
  };

  const handleFavorite = async () => {
    setFavorites([...favorites, ads[current].id]);
    await recordAction("favorite");
  };

  const nextCard = () => {
    setCurrent(curr => (curr + 1 < ads.length ? curr + 1 : 0));
  };

  if (ads.length === 0) return <p className="text-center mt-5">No exjobb ads available.</p>;

  const ad = ads[current];
  return (
    <Row className="justify-content-center mt-5">
      <Col xs={12} md={6}>
        <div className="exjobb-card-container">
          <div className="exjobb-card-inner">
            <div className="exjobb-card-front">
              {ad.imageUrl && (
                <img
                  src={ad.imageUrl}
                  className="exjobb-card-image"
                  alt="Exjobb"
                />
              )}
              <h4>{ad.title}</h4>
              <div className="mb-2 text-muted">
                <Badge bg="secondary">{ad.points} hp</Badge>&nbsp;
                <Badge bg="info">{ad.location}</Badge>
              </div>
              <p className="exjobb-card-text">
                <b>Programs:</b> {ad.programs.join(", ")}
                <br />
                <b>Number of students:</b> {ad.numStudents}
              </p>
            </div>
            <div className="exjobb-card-back">
              <h5>Description</h5>
              <p>{ad.description}</p>
            </div>
          </div>
        <div className="exjobb-card-actions">
            <Button variant="light" onClick={handleFavorite} title="Favorite">
              <span role="img" aria-label="star">
                ⭐
              </span>
            </Button>
            <Button variant="danger" onClick={handleX} title="Nope">
              <span role="img" aria-label="x">
                ❌
              </span>
            </Button>
            <Button variant="success" onClick={handleLike} title="Like">
              <span role="img" aria-label="heart">
                ❤️
              </span>
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
}