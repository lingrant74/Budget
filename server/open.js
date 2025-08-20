import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'

export default function dbProm() {
    return open({
        filename: process.env.DB_PATH || path.join(process.cwd(),'database.db'),
        driver: sqlite3.Database
    })
}