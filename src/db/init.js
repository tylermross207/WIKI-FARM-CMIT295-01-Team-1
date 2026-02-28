const db = require('./database');

async function initDatabase() {
  console.log('🔧 Initializing database...');

  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Wikis table
  db.exec(`
    CREATE TABLE IF NOT EXISTS wikis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      owner_id INTEGER NOT NULL,
      is_public INTEGER DEFAULT 1,
      allow_public_edit INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Wiki members (for private wikis or edit permissions)
  db.exec(`
    CREATE TABLE IF NOT EXISTS wiki_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wiki_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT DEFAULT 'editor',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (wiki_id) REFERENCES wikis(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(wiki_id, user_id)
    )
  `);

  // Pages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wiki_id INTEGER NOT NULL,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      created_by INTEGER NOT NULL,
      updated_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (wiki_id) REFERENCES wikis(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (updated_by) REFERENCES users(id),
      UNIQUE(wiki_id, slug)
    )
  `);

  // Page revisions for history
  db.exec(`
    CREATE TABLE IF NOT EXISTS page_revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      edited_by INTEGER NOT NULL,
      edit_summary TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
      FOREIGN KEY (edited_by) REFERENCES users(id)
    )
  `);

  // Contacts table for Contact Us submissions
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes for better performance
  db.exec(`CREATE INDEX IF NOT EXISTS idx_pages_wiki_id ON pages(wiki_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_revisions_page_id ON page_revisions(page_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_wiki_members_wiki_id ON wiki_members(wiki_id)`);

  console.log('✅ Database initialized successfully!');
}

module.exports = initDatabase;

// Run directly if called as script
if (require.main === module) {
  const { initDatabase: initDb } = require('./database');
  initDb().then(() => {
    initDatabase();
  });
}
