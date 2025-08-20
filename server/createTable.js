import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'

async function createTable() {
    const db = await open({
        filename: path.join(process.cwd(),'database.db'),
        driver: sqlite3.Database
    })

    await db.exec(`
        CREATE TABLE IF NOT EXISTS budget (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL UNIQUE,
            maximum REAL NOT NULL,
            theme TEXT NOT NULL
        )
    `)
    await db.exec(`
        CREATE TABLE IF NOT EXISTS pots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL ,
            target REAL NOT NULL,
            total REAL NOT NULL,
            theme TEXT NOT NULL
        )
    `)

    await db.close()
    console.log('table created')
}
createTable()