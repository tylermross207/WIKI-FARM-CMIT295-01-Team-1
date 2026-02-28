const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// Use Render persistent disk if available, otherwise use local path
const DB_PATH = process.env.RENDER
  ? '/opt/render/project/src/db/wikifarm.sqlite'
  : path.join(__dirname, 'wikifarm.sqlite');

let db = null;
let SQL = null;

// Initialize SQL.js and load/create database
async function initDatabase() {
  if (db) return db;
  
  SQL = await initSqlJs();
  
  // Try to load existing database
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }
  
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');
  
  return db;
}

// Save database to file
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

// Wrapper for synchronous-style API compatibility
class DatabaseWrapper {
  constructor() {
    this._initPromise = initDatabase();
  }

  async _ensureReady() {
    await this._initPromise;
  }

  prepare(sql) {
    const self = this;
    return {
      run(...params) {
        db.run(sql, params);
        saveDatabase();
        return { 
          lastInsertRowid: db.exec('SELECT last_insert_rowid()')[0]?.values[0][0],
          changes: db.getRowsModified()
        };
      },
      get(...params) {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          return row;
        }
        stmt.free();
        return undefined;
      },
      all(...params) {
        const results = [];
        const stmt = db.prepare(sql);
        stmt.bind(params);
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();
        return results;
      }
    };
  }

  exec(sql) {
    db.run(sql);
    saveDatabase();
  }

  run(sql, params = []) {
    db.run(sql, params);
    saveDatabase();
  }
}

const wrapper = new DatabaseWrapper();

module.exports = wrapper;
module.exports.initDatabase = initDatabase;
module.exports.saveDatabase = saveDatabase;
