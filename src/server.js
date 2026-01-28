const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const path = require('path');
const db = require('./db/database');

// Import routes
const authRoutes = require('./routes/auth');
const wikiRoutes = require('./routes/wiki');
const pageRoutes = require('./routes/pages');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
  secret: process.env.SESSION_SECRET || 'wiki-farm-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Make user available to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/w', wikiRoutes);
app.use('/w', pageRoutes);

// Home page - list all public wikis
app.get('/', (req, res) => {
  const wikis = db.prepare(`
    SELECT w.*, u.username as owner_name,
           (SELECT COUNT(*) FROM pages WHERE wiki_id = w.id) as page_count
    FROM wikis w
    JOIN users u ON w.owner_id = u.id
    WHERE w.is_public = 1
    ORDER BY w.created_at DESC
  `).all();
  
  res.render('home', { wikis });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', { 
    message: 'Page not found',
    error: {}
  });
});

// Initialize database and start server
const initDb = require('./db/init');

async function startServer() {
  await db.initDatabase();
  await initDb();
  
  app.listen(PORT, () => {
    console.log(`🌱 Wiki Farm is running at http://localhost:${PORT}`);
  });
}

startServer();
