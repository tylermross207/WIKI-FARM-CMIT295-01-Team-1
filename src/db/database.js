const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

// Determine database path based on environment
let DB_PATH;

if (process.env.RENDER) {
  // On Render, use a location that persists across deployments
  // The /opt/render/project directory is persistent
  DB_PATH = path.join('/opt/render/project/.data', 'wikifarm.sqlite');
} else {
  // Locally, use the src/db directory
  DB_PATH = path.join(__dirname, 'wikifarm.sqlite');
}

// Ensure directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`📁 Created database directory: ${dbDir}`);
}

let db = null;
let SQL = null;

// Initialize SQL.js and load/create database
async function initDatabase() {
  if (db) return db;
  
  console.log(`🗄️  Using database at: ${DB_PATH}`);
  
  SQL = await initSqlJs();
  
  // Try to load existing database
  if (fs.existsSync(DB_PATH)) {
    console.log('📖 Loading existing database...');
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    console.log('✨ Creating new database...');
    db = new SQL.Database();
  }
  
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');
  
  // Save initial state
  saveDatabase();
  
  return db;
}

// Save database to file
function saveDatabase() {
  if (db) {
    try {
      // Ensure directory exists before writing
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_PATH, buffer);
    } catch (err) {
      console.error('❌ Error saving database:', err.message);
    }
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
