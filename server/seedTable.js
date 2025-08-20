import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'
import { readFile } from 'node:fs/promises';

async function seedTable (){
    const dbPath= process.env.DB_PATH || path.join(process.cwd(),'database.db')
    const db = await open({
    filename:dbPath ,
    driver: sqlite3.Database
  })
  const jsonPath = process.env.DATA_JSON_PATH || path.join(process.cwd(),'public', 'data.json');
  const file = await readFile(jsonPath, 'utf8');
  const data = JSON.parse(file);
  try {

    await db.exec('BEGIN TRANSACTION')
    await db.exec('DELETE FROM budget');
    for (const {category, maximum, theme} of data.budgets)
        await db.run(`
            INSERT INTO budget (category, maximum, theme)
            VALUES (?,?,?)`,
            [category, maximum, theme]
        )
      for (const {name, target, total, theme} of data.pots)
        await db.run(`
            INSERT INTO pots (name, target, total, theme)
            VALUES (?,?,?,?)`,
            [name, target, total, theme]
        )
    await db.exec('COMMIT')
  }
  catch(err){
    await db.exec('ROLLBACK')
    console.log('Error inserting data', err.message)
  }
  finally{
    await db.close()
  }
}

seedTable()