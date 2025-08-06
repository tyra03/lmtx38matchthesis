import { useEffect, useState } from "react";
import axios from "axios";
import { ListGroup, Button, Form } from "react-bootstrap";

interface Match {
  id: number;
  companyId: number;
  studentId: number;
}

interface Message {
  id: number;
  matchId: number;
  senderId: number;
  senderRole: "company" | "student";
  content: string;
  createdAt: string;
}

export default function MatchedChats() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selected, setSelected] = useState<Match | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMatches = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/companies/matches",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMatches(res.data);
    };
    fetchMatches();
  }, []);

  const loadMessages = async (match: Match) => {
    setSelected(match);
    const res = await axios.get(
      `http://localhost:5000/api/companies/matches/${match.id}/messages`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessages(res.data);
  };

  const send = async () => {
    if (!selected || !content.trim()) return;
    const res = await axios.post(
      `http://localhost:5000/api/companies/matches/${selected.id}/messages`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessages((m) => [...m, res.data]);
    setContent("");
  };

  return (
    <div style={{ margin: "2rem" }}>
      <h2>Matches</h2>
      <ListGroup>
        {matches.map((m) => (
          <ListGroup.Item key={m.id} action onClick={() => loadMessages(m)}>
            Chat with student {m.studentId}
          </ListGroup.Item>
        ))}
      </ListGroup>
      {selected && (
        <div className="mt-3">
          <h4>Chat with student {selected.studentId}</h4>
          <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "1rem" }}>
            {messages.map((msg) => (
              <div key={msg.id}>
                <strong>{msg.senderRole}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <Form
            className="mt-2"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <Form.Control
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type a message"
            />
            <Button className="mt-2" onClick={send}>
              Send
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}