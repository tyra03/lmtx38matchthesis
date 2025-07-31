import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Button, Badge, Spinner, Alert } from "react-bootstrap";
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

export default function FavoriteAds() {
  const [ads, setAds] = useState<ExjobbAd[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<number>();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const userRes = await axios.get("http://localhost:5000/api/students/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const id = userRes.data.id as number;
        setUserId(id);
        const favRes = await axios.get(
          `http://localhost:5000/api/users/${id}/favorites`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAds(favRes.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const removeCurrent = () => {
    setAds((prev) => {
      const updated = prev.filter((_, idx) => idx !== current);
      if (current >= updated.length) setCurrent(0);
      return updated;
    });
  };

  const sendAction = async (type: "like" | "dislike" | "unfavorite") => {
    if (!userId) return;
    try {
      const token = localStorage.getItem("token");
      const adId = ads[current].id;
      await axios.post(
        `http://localhost:5000/api/users/${userId}/actions`,
        { adId, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      removeCurrent();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update favorites.");
    }
  };

  if (loading) return <Spinner animation="border" className="m-4" />;
  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;
  if (ads.length === 0) return <p className="text-center mt-5">No favorites found.</p>;

  const ad = ads[current];

  return (
    <Row className="justify-content-center mt-5">
      <Col xs={12} md={6}>
        <div className="exjobb-card-container">
          <div className="exjobb-card-inner">
            <div className="exjobb-card-front">
              {ad.imageUrl && (
                <img src={ad.imageUrl} className="exjobb-card-image" alt="Exjobb" />
              )}
              <h4>{ad.title}</h4>
              <div className="mb-2 text-muted">
                <Badge bg="secondary">{ad.points} hp</Badge>&nbsp;
                <Badge bg="info">{ad.location}</Badge>
              </div>
              <p>
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
        </div>
        <div className="d-flex justify-content-around mt-4">
          <Button variant="light" onClick={() => sendAction("unfavorite")} title="Unfavorite">
            <span role="img" aria-label="star">⭐</span>
          </Button>
          <Button variant="danger" onClick={() => sendAction("dislike")} title="Nope">
            <span role="img" aria-label="x">❌</span>
          </Button>
          <Button variant="success" onClick={() => sendAction("like")} title="Like">
            <span role="img" aria-label="heart">❤️</span>
          </Button>
        </div>
      </Col>
    </Row>
  );
}