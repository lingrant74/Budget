import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'node:path';



export async function addBudget(category, maximum,  theme) {
    const dbPath = path.join(process.cwd(), 'database.db')
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    })
    try {
        const info = await db.run('INSERT INTO budget (category, maximum,  theme) VALUES (?,?,?)',
            [category, maximum,  theme])

        const newId = info.lastID ?? info.lastInsertRowid;
        const row = await db.get('SELECT * FROM budget WHERE id = ?', [newId]);
        return (row ?? { id: newId, category, maximum,  theme });
    }
    catch (err) {
        console.error('POST /data/budget error:', err);
        return ({ error: err.message || 'Server error' });
    }
    finally {
        if (db) await db.close();
    }


}