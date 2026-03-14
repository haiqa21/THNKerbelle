import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// This line is the answer to your question:
// better-sqlite3 creates app.db automatically if it doesn't exist.
// You just give it a file path — no setup needed.
const db = new Database(path.join(__dirname, '../app.db'))

// Enable WAL mode — makes reads/writes faster and safer
db.pragma('journal_mode = WAL')

// Create all tables on startup if they don't exist yet.
// Running this every time is safe — the IF NOT EXISTS means
// it won't overwrite data on restarts.
// this has data / stuff for a social media app, but you can change it to whatever you want! 
// just make sure to update the seed.js file with matching tables/columns if you change this.
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    username    TEXT UNIQUE NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT NOT NULL,
    avatar_url  TEXT,
    bio         TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  
`)

export default db
