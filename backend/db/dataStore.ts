import { DataStore, User, Event } from '../interfaces';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';

// Initial in-memory store
let data: DataStore = {
  users: [],
  events: []
};

// ---------- Basic Functions ----------

// Access current data
function getData(): DataStore {
  return data;
}

// Load from JSON file
function loadData() {
  const dataString = fs.readFileSync('./database.json', 'utf-8');
  data = JSON.parse(dataString);
}

// Save to JSON file
function saveData() {
  fs.writeFileSync('./database.json', JSON.stringify(data, null, 2));
}

// Register a new user
async function registerUser(
  name: string,
  email: string,
  password: string,
  bio = ''
): Promise<User> {
  // Check if email exists
  if (data.users.find(u => u.email === email)) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: uuid(),
    name,
    email,
    password: hashedPassword,
    bio,
    quizAnswers: [],
    registeredEvents: []
  };

  data.users.push(newUser);
  saveData();
  return newUser;
}

// Login user
async function loginUser(email: string, password: string): Promise<User> {
  const user = data.users.find(u => u.email === email);
  if (!user) throw new Error('Invalid email or password');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid email or password');

  return user;
}

// Create a new event
function createEvent(
  name: string,
  date: string,
  time: string,
  location: string,
  description: string,
  code?: number
): Event {
  const newEvent: Event = {
    id: uuid(),
    name,
    date,
    time,
    location,
    attendees: [],
    description,
    code: code || Math.floor(100000 + Math.random() * 900000) 
  };

  data.events.push(newEvent);
  saveData();
  return newEvent;
}

// User joins an event
function joinEvent(userId: string, eventId: string, code?: number) {
  const user = data.users.find(u => u.id === userId);
  const event = data.events.find(e => e.id === eventId);

  if (!user || !event) throw new Error('User or event not found');
  if (code && event.code !== code) throw new Error('Invalid event code');

  if (!user.registeredEvents.includes(eventId)) {
    user.registeredEvents.push(eventId);
  }

  if (!event.attendees.includes(userId)) {
    event.attendees.push(userId);
  }

  saveData();
  return { user, event };
}

// Get attendees for an event
function getEventAttendees(eventId: string): User[] {
  const event = data.events.find(e => e.id === eventId);
  if (!event) return [];

  return event.attendees.map(uid => data.users.find(u => u.id === uid)!);
}

export {
  getData,
  loadData,
  saveData,
  registerUser,
  loginUser,
  createEvent,
  joinEvent,
  getEventAttendees
};