import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'node:path';



export async function addPot(name, target, total, theme) {
    const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'database.db')
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    })
    try {
        const info = await db.run('INSERT INTO pots (name, target, total,theme) VALUES (?,?,?,?)',
            [name, target, total, theme])

        const newId = info.lastID ?? info.lastInsertRowid;
        const row = await db.get('SELECT * FROM pots WHERE id = ?', [newId]);
        return (row ?? { id: newId, name, target, total, theme });
    }
    catch (err) {
        console.error('POST /data/pots error:', err);
        return ({ error: err.message || 'Server error' });
    }
    finally {
        if (db) await db.close();
    }


}