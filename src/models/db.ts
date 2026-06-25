import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data/portfolio.db');

// Initialize database
const db = new Database(dbPath, { verbose: console.log });

// Create tables if they don't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        received_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

export default db;
