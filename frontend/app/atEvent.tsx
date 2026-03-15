import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

type Person = {
  id: string;
  name: string;
  bio: string;
  matchScore: number;
};

const userId = "1"; // replace with real logged-in user
const eventId = "123"; // replace with current event

export default function MatchedFriends() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
    const load = async () => {
      const id = await AsyncStorage.getItem('userId')
      console.log('userId from AsyncStorage:', id)  // ← helpful for debugging
    }
    load()
  }, [])

  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}/registeredEnterance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    })
      .then(res => res.json())
      .then(data => {
        setPeople(data.people);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={loadingStyle}>Loading friends...</div>;

  if (people.length === 0) return <div style={loadingStyle}>No matches yet</div>;

  // determine min and max match score
  const scores = people.map(p => p.matchScore);
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);

  function getColor(score: number) {
    if (score === maxScore) return "#22c55e"; // green
    if (score === minScore) return "#ef4444"; // red
    return "#f97316"; // orange for middle
  }

  return (
    <div style={containerStyle}>
      {people.map(person => (
        <div key={person.id} style={{ ...cardStyle, borderLeft: `6px solid ${getColor(person.matchScore)}` }}>
          <h3 style={titleStyle}>{person.name}</h3>
          <p>{person.bio}</p>
          <p style={scoreStyle}>Match Score: {person.matchScore}</p>
        </div>
      ))}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "16px",
  padding: "20px"
};

const cardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "16px",
  background: "white",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  transition: "transform 0.2s, box-shadow 0.2s",
  cursor: "pointer",
};

const titleStyle: React.CSSProperties = {
  marginBottom: "8px",
  fontSize: "1.1rem",
  fontWeight: "bold"
};

const scoreStyle: React.CSSProperties = {
  marginTop: "10px",
  fontWeight: "bold"
};

const loadingStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "40px",
  fontSize: "1.2rem"
};