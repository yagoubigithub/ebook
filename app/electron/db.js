import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function createDatabase() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });

  // Create a notes table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT,
      "column-1" TEXT
    );
  `);

  // Create a column table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS columns (
      id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE ,
      name TEXT,
      desc TEXT
    );
  `);

  await db.exec(
    'INSERT OR IGNORE INTO columns (id , name, desc) VALUES (1, "Notes", "Create Note")',
  );

  return db;
}

export default createDatabase;
