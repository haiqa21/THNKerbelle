import express, { json, Request, Response } from 'express';
import cors from 'cors'
import morgan from 'morgan';
import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import process from 'process';
// import authRoutes  from './routes/auth.js'
import authRoutes from './routes/auth';


const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())                    // allow requests from your React Native app
app.use(json())                   // parse JSON request bodies
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes); 


// Health check — useful for Railway/Render deployment
app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
  console.log(`   app.db auto-created next to server.js if it didn't exist`)
})

