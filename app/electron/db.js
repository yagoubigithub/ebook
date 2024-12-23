import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function createDatabase() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });

  // Create a sample table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT,
      note TEXT
    );
  `);

  return db;
}

export default createDatabase;
