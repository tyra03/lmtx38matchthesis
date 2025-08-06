import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Alert, Button } from "react-bootstrap";
import StudentCard from "./studentCard";

interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  program?: string;
  description?: string;
  imageUrl?: string;
}

export default function StudentSwipeDeck() {
  const [students, setStudents] = useState<Student[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startX, setStartX] = useState<number | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get<Student[]>(
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

  const handleAction = async (action: "like" | "dislike") => {
    const student = students[current];
    if (!student) return;
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `http://localhost:5000/api/companies/students/${student.id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      // ignore errors for now
    }
    setCurrent((c) => c + 1);
  };

  const onTouchStart = (e: React.TouchEvent) => setStartX(e.touches[0].clientX);
  const onMouseDown = (e: React.MouseEvent) => setStartX(e.clientX);

  const handleMoveEnd = (clientX: number) => {
    if (startX === null) return;
    const diff = clientX - startX;
    if (diff > 100) handleAction("like");
    else if (diff < -100) handleAction("dislike");
    setStartX(null);
  };

  const onTouchEnd = (e: React.TouchEvent) => handleMoveEnd(e.changedTouches[0].clientX);
  const onMouseUp = (e: React.MouseEvent) => handleMoveEnd(e.clientX);

  if (loading) return <Spinner animation="border" style={{ margin: "2rem" }} />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (current >= students.length)
    return <div style={{ margin: "2rem" }}>No more students</div>;

  const student = students[current];

  return (
    <div
      style={{ margin: "2rem" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
    >
      <StudentCard student={student} showActions={false} />
      <div style={{ marginTop: "1rem" }}>
        <Button
          variant="secondary"
          className="me-2"
          onClick={() => handleAction("dislike")}
        >
          Dislike
        </Button>
        <Button variant="success" onClick={() => handleAction("like")}>
          Like
        </Button>
      </div>
    </div>
  );
}