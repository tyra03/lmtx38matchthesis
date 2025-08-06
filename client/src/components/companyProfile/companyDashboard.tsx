import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";

interface Student {
  id: number;
  name: string;
  email: string;
  program?: string;
}

export default function CompanyDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
    const [ads, setAds] = useState<{ id: number; title: string }[]>([]);
  const [selectedAd, setSelectedAd] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sendAction = async (
    studentId: number,
    type: "like" | "dislike" | "favorite"
  ) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/companies/students/actions",
        { studentId, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to record action", err);
    }
  };

  // Fetch ads on mount
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/companies/me/ads",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAds(res.data);
        if (res.data.length > 0) {
          setSelectedAd(res.data[0].id);
        } else {
          setLoading(false);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch ads");
        setLoading(false);
      }
    };

    fetchAds();
  }, []);


  // Fetch students whenever selectedAd changes
  useEffect(() => {
    if (!selectedAd) return;
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/companies/ads/${selectedAd}/students`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchStudents();
  }, [selectedAd]);

  if (loading) return <Spinner animation="border" style={{ margin: "2rem" }} />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div style={{ margin: "2rem" }}>
      <h2>Student Profiles</h2>
      {ads.length > 0 ? (
        <Form.Select
          value={selectedAd ?? ""}
          onChange={(e) => setSelectedAd(parseInt(e.target.value, 10))}
          className="mb-3"
        >
          {ads.map((ad) => (
            <option key={ad.id} value={ad.id}>
              {ad.title}
            </option>
          ))}
        </Form.Select>
      ) : (
        <p>No ads available.</p>
      )}
      {students.length === 0 ? (
        <p>No matching students found.</p>
      ) : (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Program</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.program}</td>
              <td>{s.email}</td>
              <td className="text-center">
                <Button
                  variant="light"
                  size="sm"
                  className="me-1"
                  onClick={() => sendAction(s.id, "favorite")}
                  title="Favorite"
                >
                  ⭐
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="me-1"
                  onClick={() => sendAction(s.id, "dislike")}
                  title="Nope"
                >
                  ❌
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => sendAction(s.id, "like")}
                  title="Like"
                >
                  ❤️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      )}
    </div>
  );
}