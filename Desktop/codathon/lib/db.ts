import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'data', 'interview.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize schema
export function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Question sets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS question_sets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK(difficulty IN ('Junior', 'Mid', 'Senior')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Questions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question_set_id INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      model_answer TEXT NOT NULL,
      tags TEXT NOT NULL,
      question_number INTEGER NOT NULL,
      FOREIGN KEY (question_set_id) REFERENCES question_sets(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better query performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_question_sets_user_id ON question_sets(user_id);
    CREATE INDEX IF NOT EXISTS idx_questions_set_id ON questions(question_set_id);
  `);
}

// Initialize database on import
initDatabase();

export default db;

