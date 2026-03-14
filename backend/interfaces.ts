export interface DataStore {
  users: User[];
  events: Event[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  bio: string;
  quizAnswers: number[];
  registeredEvents: string[]; 
}

export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  attendees: string[];   
  description: string;
  code: number;
}