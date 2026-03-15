import { Router, Request, Response } from 'express';
import { loadData, writeDataFile } from '../db/dataStore';
import { Recipe, User } from '../interfaces';
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
  const newUser: User = { id: uuid(), name, email, password: hashedPassword, bio: bio || '', quizAnswers: [], registeredEvents: [], coins: 0,
    currentRecipe: null, 
    recipeProgress: 0,
    completedRecipes: []};
  
  data.users.push(newUser);


  const recipes: Recipe[] = [
    {
    id: 0,
    name: 'Pie',
    steps: [
      'Mix apples with sugar and cinnamon',
      'Assemble crust and filling',
      'Bake in the oven!'
    ],
    pointCosts: [5,5,5]
    }, 
    {
      id: 1,
      name: 'Cake',
      steps: [
        'Mix flour, sugar, eggs, and butter',
        'Pour into pan and bake',
        'Frost the cake'
      ],
      pointCosts: [5,5,10]
    }, 
    {
      id: 2,
      name: 'Bread',
      steps: [
        'Mix flour, water, yeast, and salt',
        'Let the dough rise',
        'Bake in the oven!'
      ],
      pointCosts: [5,5,5]
    }, 
    {
      id: 3,
      name: 'Croissant',
      steps: [
        'Make the dough and let it rise',
        'Roll out the dough and fold with butter',
        'Shape into croissants and bake'
      ],
      pointCosts: [5,10,10]
    }
  ]

  const events = [
    {
      id: '1',
      name: 'Sourdough Sunday',
      date: '2024-12-01',
      time: '15:00',
      location: 'Central Park',
      attendees: [],
      description: 'Join us for a day of sourdough baking and fun in the park!',
      code: 'SOURDOUGH123'
    }, 
    {
      id: '2',
      name: 'Pastry Picnic',
      date: '2024-12-15',
      time: '12:00',
      location: 'Riverside Park',
      attendees: [],
      description: 'Bring your favorite pastries and enjoy a picnic by the river!',
      code: 'PASTRY456'
    }
  ]

  data.recipes = recipes; 
  data.events = events;
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

export default router;

