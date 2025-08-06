import { Card, Button } from "react-bootstrap";
import axios from "axios";

interface Student {
  id: number;
  name: string;
  phone: string;
  email: string;
  program?: string;
  description?: string;
  imageUrl?: string;
}

interface Props {
  student: Student;
}

export default function StudentCard({ student }: Props) {
  const token = localStorage.getItem("token");

  const handleAction = async (type: "like" | "favorite" | "dislike") => {
    await axios.post(
      `http://localhost:5000/api/companies/students/${student.id}/${type}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  return (
    <Card className="mb-3">
        {student.imageUrl && (
        <Card.Img
          variant="top"
          src={student.imageUrl}
          alt={`${student.name}'s profile`}
        />
      )}
      <Card.Body>
        <Card.Title>{student.name}</Card.Title>
        {student.program && (
          <Card.Subtitle className="mb-2 text-muted">
            {student.program}
          </Card.Subtitle>
        )}
        {student.description && <Card.Text>{student.description}</Card.Text>}
        <Card.Text>
          <strong>Email:</strong> {student.email}
        </Card.Text>
        <Card.Text>
          <strong>Phone:</strong> {student.phone}
        </Card.Text>
        <Button
          variant="success"
          className="me-2"
          onClick={() => handleAction("like")}
        >
          Like
        </Button>
        <Button
          variant="warning"
          className="me-2"
          onClick={() => handleAction("favorite")}
        >
          Favorite
        </Button>
        <Button variant="secondary" onClick={() => handleAction("dislike")}>Dislike</Button>
      </Card.Body>
    </Card>
  );
}