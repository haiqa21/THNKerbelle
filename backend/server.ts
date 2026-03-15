import express, { json, Request, Response } from 'express';
import { loadData, writeDataFile } from './db/dataStore.js'
import { User } from './interfaces';
import cors from 'cors'
import morgan from 'morgan';
import process from 'process';
import authRoutes from './routes/auth'
import quizRoutes from './routes/quiz'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())                    // allow requests from your React Native app
app.use(json())            // parse JSON request bodies
app.use(morgan('dev'));
// Routes
app.use('/auth', authRoutes)
app.use('/quiz', quizRoutes);


// Health check — useful for Railway/Render deployment
app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`   app.db auto-created next to server.js if it didn't exist`)
})

// listing all the events registered by the user
app.get('/events', (req: Request, res: Response) => {
  const userId = req.header('userId');
  const data = loadData();
  const userObj: User | undefined = data.users.find(
    (user: User) => userId === user.id);
  if (!userObj) {
    return res.status(401).json({ error: 'Invalid UserId' });
  } else {
    return res.json({ events: userObj.registeredEvents })
  }
})


