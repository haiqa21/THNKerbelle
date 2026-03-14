interface DataStore {
  users: User[];
  events: Event[];
}

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  quizAnswers: number[];
  registeredEvents: Event[];
}

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  attendees: User[];
  description: string;
  code: number;
}