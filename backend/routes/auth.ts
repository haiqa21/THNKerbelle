import { Router, Request, Response } from 'express';
import { loadData, writeDataFile } from '../db/dataStore';
import { User } from '../interfaces';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password, bio } = req.body;
  const data = loadData();

  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  if (data.users.find(u => u.email === email)) return res.status(400).json({ error: 'Email exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = { id: uuid(), name, email, password: hashedPassword, bio: bio || '', quizAnswers: [], registeredEvents: [] };
  
  data.users.push(newUser);
  writeDataFile(data);

  res.status(201).json({ message: 'Registered', userId: newUser.id });
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = loadData();
  const user = data.users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

  res.json({ message: 'Login successful', user: { id: user.id, name: user.name } });
});


// Get /events - list all events
router.get('/events', async (req: Request, res: Response) => {
  const { userId } = req.body;
  const data = loadData();
  const user = data.users.find(u => u.id === userId);
  if(!user){
    return res.status(400).json({ error: 'Invalid User' });
  }
  return res.json(user?.registeredEvents)
});

export default router;
