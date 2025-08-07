import { useEffect, useState } from "react";
import axios from "axios";
import { ListGroup, Button, Form } from "react-bootstrap";

interface Match {
  id: number;
  companyId: number;
  studentId: number;
  student: {
    id: number;
    name: string;
  };
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
    <div className="bg-white p-3" style={{ margin: "2rem" }}>
      <h2>Chat about {selected ? selected.student.name : ""}</h2>
      <div className="d-flex">
        <div style={{ width: "250px", maxHeight: "400px", overflowY: "auto" }}>
          <ListGroup>
            {matches.map((m) => (
              <ListGroup.Item
                key={m.id}
                action
                onClick={() => loadMessages(m)}
              >
                Chat with student {m.student.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
        <div className="ms-3 flex-grow-1 d-flex flex-column">
          {selected ? (
            <>
              <div className="flex-grow-1 overflow-auto border p-2">
                {messages.map((msg) => (
                  <div key={msg.id}>
                    <strong>{msg.senderRole}:</strong> {msg.content}
                  </div>
                ))}
              </div>
              <Form
                className="mt-2 d-flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <Form.Control
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type a message"
                  className="me-2"
                />
                <Button onClick={send}>Send</Button>
              </Form>
            </>
          ) : (
            <div>Select a match to start chatting</div>
          )}
        </div>
     </div>
    </div>
  );
}