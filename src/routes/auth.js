const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/database');

const router = express.Router();

// Login page
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/login', { error: null });
});

// Login handler
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE username = ? OR email = ?').get(username, username);

  if (!user) {
    return res.render('auth/login', { error: 'Invalid username or password' });
  }

  const validPassword = bcrypt.compareSync(password, user.password_hash);
  if (!validPassword) {
    return res.render('auth/login', { error: 'Invalid username or password' });
  }

  // Set session
  req.session.user = {
    id: user.id,
    username: user.username,
    email: user.email,
    is_admin: user.is_admin
  };

  res.redirect('/');
});

// Register page
router.get('/register', (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('auth/register', { error: null });
});

// Register handler
router.post('/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.render('auth/register', { error: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.render('auth/register', { error: 'Passwords do not match' });
  }

  if (password.length < 6) {
    return res.render('auth/register', { error: 'Password must be at least 6 characters' });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.render('auth/register', { error: 'Username can only contain letters, numbers, and underscores' });
  }

  // Check if user exists
  const existingUser = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
  if (existingUser) {
    return res.render('auth/register', { error: 'Username or email already exists' });
  }

  // Create user
  const passwordHash = bcrypt.hashSync(password, 10);
  
  // First user becomes admin
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  const isAdmin = userCount.count === 0 ? 1 : 0;

  try {
    const result = db.prepare(`
      INSERT INTO users (username, email, password_hash, is_admin)
      VALUES (?, ?, ?, ?)
    `).run(username, email, passwordHash, isAdmin);

    req.session.user = {
      id: result.lastInsertRowid,
      username,
      email,
      is_admin: isAdmin
    };

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('auth/register', { error: 'Failed to create account' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
