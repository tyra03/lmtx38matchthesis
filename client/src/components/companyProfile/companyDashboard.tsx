import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert } from "react-bootstrap";

interface Student {
  id: number;
  name: string;
  email: string;
  program?: string;
}

export default function CompanyDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/companies/students",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStudents(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  if (loading) return <Spinner animation="border" style={{ margin: "2rem" }} />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div style={{ margin: "2rem" }}>
      <h2>Student Profiles</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Program</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.program}</td>
              <td>{s.email}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}