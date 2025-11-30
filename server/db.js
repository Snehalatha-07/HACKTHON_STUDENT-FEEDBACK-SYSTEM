const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'data.sqlite');

function initDb() {
  const db = new sqlite3.Database(DB_PATH);
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  db.serialize(() => {
    files.forEach(f => {
      const sql = fs.readFileSync(path.join(migrationsDir, f), 'utf8');
      try {
        db.exec(sql);
        console.log('Applied migration', f);
      } catch (err) {
        console.error('Migration error', f, err.message);
      }
    });
  });
  return db;
}

module.exports = { initDb };
