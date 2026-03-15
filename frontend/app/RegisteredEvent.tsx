import * as React from "react";
import { useEffect, useState } from "react";

type Event = {
  id: string;
  name: string;
  time: string;
  location: string;
};

const userId = "1"; // replace later with logged-in user

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [codes, setCodes] = useState<{ [key: string]: string }>({});
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetch(`http://localhost:3000/events?userId=${userId}`)
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  async function joinEvent(eventId: string) {
    try {
      const res = await fetch(`http://localhost:3000/events/${eventId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId,
          code: codes[eventId]
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);
        return;
      }

      setMessage(`Successfully joined ${data.event.name}`);
    } catch (err) {
      setMessage("Something went wrong");
    }
  }

  return (
    <div style={containerStyle}>
      {events.map(event => (
        <div key={event.id} style={cardStyle}>
          <h3>{event.name}</h3>
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

          <button onClick={() => joinEvent(event.id)} style={buttonStyle}>
            Join Event
          </button>
        </div>
      ))}

      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px",
  padding: "20px"
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "16px",
  background: "white",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

const inputStyle: React.CSSProperties = {
  marginTop: "10px",
  padding: "8px",
  width: "100%",
  marginBottom: "10px"
};

const buttonStyle: React.CSSProperties = {
  padding: "8px 12px",
  cursor: "pointer"
};

const messageStyle: React.CSSProperties = {
  gridColumn: "1 / -1",
  textAlign: "center",
  fontWeight: "bold"
};