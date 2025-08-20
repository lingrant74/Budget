import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'
import dbProm from './open.js'

export async function alterBudgets (id, { maximum, theme }) {
    console.log(maximum, theme)
    const db = await dbProm();
    const updates = [];
    const values = [];
    if (maximum != null){
        updates.push('maximum = ?')
        values.push(maximum)
    }
    if (theme != null){
        updates.push('theme = ?')
        values.push(theme)
    }
    if (updates.length === 0) return;
    values.push(id)
    await db.run(
        `UPDATE budget SET ${updates.join(", ")} WHERE id = ?`,
        values
        )
    await db.close()
}