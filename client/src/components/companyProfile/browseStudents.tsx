import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Alert } from "react-bootstrap";
import StudentCard from "./studentCard";

interface Student {
  id: number;
  name: string;
  program?: string;
  description?: string;
}

export default function StudentBrowser() {
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
      {students.map((s) => (
        <StudentCard key={s.id} student={s} />
      ))}
    </div>
  );
}