import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
  return db;
}

export async function init () {
    const db = await openDb();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        password TEXT
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS grupos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            titulo TEXT,

            FOREIGN KEY (user_id) REFERENCES usuarios(id)
        );
    `);
}

