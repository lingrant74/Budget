import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'
import dbProm from './open.js'

export async function alterPots (id, delta) {
    const db = await dbProm();
    await db.run(
        `UPDATE pots SET total =  total + ? WHERE id = ?`,
        delta , id
        ) 

}