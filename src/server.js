const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const path = require('path');
const fs = require('fs');
const db = require('./db/database');

// Import routes
const authRoutes = require('./routes/auth');
const wikiRoutes = require('./routes/wiki');
const pageRoutes = require('./routes/pages');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploaded files from persistent storage on Render
if (process.env.RENDER) {
  const persistentUploadsDir = '/opt/render/project/.data/uploads';
  if (!fs.existsSync(persistentUploadsDir)) {
    fs.mkdirSync(persistentUploadsDir, { recursive: true });
  }
  // Serve files from the persistent storage directory at /uploads route
  app.use('/uploads', express.static(persistentUploadsDir));
} else {
  // In development, uploads are in public/uploads (already served by express.static above)
}

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
  
  // Load user's theme preference if logged in
  if (req.session.user && !req.session.user.theme) {
    const prefs = db.prepare('SELECT theme_name FROM user_preferences WHERE user_id = ?').get(req.session.user.id);
    req.session.user.theme = prefs?.theme_name || 'burgundy';
  }
  
  res.locals.userTheme = req.session.user?.theme || 'burgundy';
  next();
});

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/settings', settingsRoutes);
app.use('/w', wikiRoutes);
app.use('/w', pageRoutes);
app.use('/contact', contactRoutes);

// About Us page
app.get('/about', (req, res) => {
  res.render('about');
});

// Home page - list all wikis
app.get('/', (req, res) => {
  const wikis = db.prepare(`
    SELECT w.*, u.username as owner_name,
           (SELECT COUNT(*) FROM pages WHERE wiki_id = w.id) as page_count
    FROM wikis w
    LEFT JOIN users u ON w.owner_id = u.id
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
