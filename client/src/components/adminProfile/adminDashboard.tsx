import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface ExjobbAd {
  id: number;
  title: string;
  description: string;
}

export default function adminDashboard() {
  const [ads, setAds] = useState<ExjobbAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/pending-ads", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAds(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch ads");
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, [token]);

  const approveAd = async (id: number) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/ads/${id}/status`,
        { status: "accepted" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAds((prev) => prev.filter((ad) => ad.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to approve ad");
    }
  };

  const rejectAd = async (id: number) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/admin/ads/${id}/status`,
        { status: "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAds((prev) => prev.filter((ad) => ad.id !== id));
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to reject ad");
    }
  };

  if (loading) return <Spinner animation="border" style={{ margin: "2rem" }} />;

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto" }}>
      <h2>Pending Exjobb Ads</h2>
      {ads.length === 0 && <p>No pending ads</p>}
      {ads.map((ad) => (
        <Card key={ad.id} className="mb-3">
          <Card.Body>
            <Card.Title>{ad.title}</Card.Title>
            <Card.Text>{ad.description}</Card.Text>
            <Button onClick={() => approveAd(ad.id)} className="me-2">Approve</Button>
            <Button variant="danger" onClick={() => rejectAd(ad.id)} className="ms-2">Reject</Button>
          </Card.Body>
        </Card>
      ))}
      <Button variant="secondary" onClick={() => navigate("/")}>Back</Button>
    </div>
  );
}