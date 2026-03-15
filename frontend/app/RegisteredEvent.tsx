import { useEffect, useState } from "react";
import { getEvents, joinEvent } from "../lib/api";  // ← import your api functions

type Event = {
  id: string;
  name: string;
  time: string;
  location: string;
};

const userId = "1";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [codes, setCodes] = useState<{ [key: string]: string }>({});
  const [messages, setMessages] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getEvents(userId)  // ← replaced inline fetch with api function
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  async function handleJoinEvent(eventId: string) {
    try {
      const { data, ok } = await joinEvent(eventId, userId, codes[eventId]);  // ← replaced inline fetch

      if (!ok) {
        setMessages(prev => ({ ...prev, [eventId]: data.error }));
        return;
      }

      setMessages(prev => ({ ...prev, [eventId]: `✅ Joined ${data.event.name}` }));
    } catch (err) {
      setMessages(prev => ({ ...prev, [eventId]: "❌ Something went wrong" }));
    }
  }

  return (
    <div style={gridContainer}>
      {events.map(event => (
        <div key={event.id} style={cardStyle}>
          <h3 style={titleStyle}>{event.name}</h3>
          <p><b>Time:</b> {event.time}</p>
          <p><b>Location:</b> {event.location}</p>

          <input
            type="text"
            placeholder="Enter event code"
            value={codes[event.id] || ""}
            onChange={(e) =>
              setCodes({ ...codes, [event.id]: e.target.value })
            }
            style={inputStyle}
          />

          <button
            onClick={() => handleJoinEvent(event.id)}
            style={buttonStyle}
          >
            Join Event
          </button>

          {messages[event.id] && (
            <p style={messageStyle}>{messages[event.id]}</p>
          )}
        </div>
      ))}
    </div>
  );
}

const gridContainer: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px",
  padding: "20px",
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "16px",
  background: "#ffffff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  transition: "transform 0.2s, box-shadow 0.2s",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
};

const titleStyle: React.CSSProperties = {
  marginBottom: "10px",
  fontSize: "1.2rem",
  color: "#333",
};

const inputStyle: React.CSSProperties = {
  marginTop: "10px",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  width: "100%",
  marginBottom: "10px",
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: "6px",
  border: "none",
  backgroundColor: "#4f46e5",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

const messageStyle: React.CSSProperties = {
  marginTop: "8px",
  fontWeight: "bold",
  color: "#111",
};

/* Hover effects using inline style workaround */
Object.assign(cardStyle, {
  ":hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
  }
});

Object.assign(buttonStyle, {
  ":hover": {
    backgroundColor: "#4338ca"
  }
});