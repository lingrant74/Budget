import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'

async function getData() {
    const db = await open({

    filename: process.env.DB_PATH || path.join(process.cwd(), 'database.db'),
    driver: sqlite3.Database
  })
  try {
    const query = `SELECT * FROM budgets WHERE `
    const params = ['']
    const data = await db.all(`SELECT * FROM budgets`)
  }
  catch (err){

  }
}
getData()