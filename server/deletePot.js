import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'node:path';

export async function deletePot(id) {
    const idNum = Number(id);
    if (!Number.isInteger(idNum)) {
        const e = new Error('Invalid id');
        e.status = 400;
        throw e;
    }
    const dbPath = path.join(process.cwd(), 'database.db');
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });
    try {
        const info = await db.run('DELETE FROM pots WHERE id = ?', idNum);
        if (info.changes === 0) {
            const e = new Error('Pot not found');
            e.status = 404;
            throw e;
        }
        return info;
    } finally {
        await db.close();
    }
}