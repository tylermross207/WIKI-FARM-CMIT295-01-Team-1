const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Use Render persistent disk if available, otherwise use local path
const DB_DIR = process.env.RENDER ? '/var/data' : __dirname;
const DB_PATH = path.join(DB_DIR, 'wikifarm.sqlite');

// Ensure directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize database connection
const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create a wrapper for compatibility with existing code
class DatabaseWrapper {
  prepare(sql) {
    const stmt = db.prepare(sql);
    return {
      run(...params) {
        const info = stmt.run(...params);
        return {
          lastInsertRowid: info.lastInsertRowid,
          changes: info.changes
        };
      },
      get(...params) {
        return stmt.get(...params);
      },
      all(...params) {
        return stmt.all(...params);
      }
    };
  }

  exec(sql) {
    db.exec(sql);
  }

  run(sql, params = []) {
    db.prepare(sql).run(...params);
  }
}

const wrapper = new DatabaseWrapper();

// Initialize database
async function initDatabase() {
  return wrapper;
}

module.exports = wrapper;
module.exports.initDatabase = initDatabase;
