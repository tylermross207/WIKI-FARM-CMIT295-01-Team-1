const express = require('express');
const db = require('../db/database');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Admin dashboard
router.get('/', requireAuth, requireAdmin, (req, res) => {
  const stats = {
    users: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
    wikis: db.prepare('SELECT COUNT(*) as count FROM wikis').get().count,
    pages: db.prepare('SELECT COUNT(*) as count FROM pages').get().count,
    revisions: db.prepare('SELECT COUNT(*) as count FROM page_revisions').get().count
  };

  const recentWikis = db.prepare(`
    SELECT w.*, u.username as owner_name
    FROM wikis w
    JOIN users u ON w.owner_id = u.id
    ORDER BY w.created_at DESC
    LIMIT 10
  `).all();

  const recentUsers = db.prepare(`
    SELECT * FROM users ORDER BY created_at DESC LIMIT 10
  `).all();

  res.render('admin/dashboard', { stats, recentWikis, recentUsers });
});

// List all users
router.get('/users', requireAuth, requireAdmin, (req, res) => {
  const users = db.prepare(`
    SELECT u.*, 
           (SELECT COUNT(*) FROM wikis WHERE owner_id = u.id) as wiki_count
    FROM users u
    ORDER BY u.created_at DESC
  `).all();

  res.render('admin/users', { users, success: req.query.success });
});

// Toggle user admin status
router.post('/users/:userId/toggle-admin', requireAuth, requireAdmin, (req, res) => {
  const { userId } = req.params;

  if (parseInt(userId) === req.session.user.id) {
    return res.status(400).json({ error: 'Cannot modify your own admin status' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  db.prepare('UPDATE users SET is_admin = ? WHERE id = ?').run(user.is_admin ? 0 : 1, userId);
  res.redirect('/admin/users');
});

// Delete user
router.post('/users/:userId/delete', requireAuth, requireAdmin, (req, res) => {
  const { userId } = req.params;

  if (parseInt(userId) === req.session.user.id) {
    return res.status(400).json({ error: 'Cannot delete yourself' });
  }

  db.prepare('DELETE FROM users WHERE id = ?').run(userId);
  res.redirect('/admin/users');
});

// List all wikis
router.get('/wikis', requireAuth, requireAdmin, (req, res) => {
  const wikis = db.prepare(`
    SELECT w.*, u.username as owner_name,
           (SELECT COUNT(*) FROM pages WHERE wiki_id = w.id) as page_count
    FROM wikis w
    JOIN users u ON w.owner_id = u.id
    ORDER BY w.created_at DESC
  `).all();

  res.render('admin/wikis', { wikis });
});

// Delete wiki (admin)
router.post('/wikis/:wikiId/delete', requireAuth, requireAdmin, (req, res) => {
  const { wikiId } = req.params;
  db.prepare('DELETE FROM wikis WHERE id = ?').run(wikiId);
  res.redirect('/admin/wikis');
});

// List all contact messages
router.get('/contact-messages', requireAuth, requireAdmin, (req, res) => {
  const messages = db.prepare(`
    SELECT * FROM contacts
    ORDER BY created_at DESC
  `).all();

  res.render('admin/contact-messages', { messages });
});

// Delete contact message
router.post('/contact-messages/:messageId/delete', requireAuth, requireAdmin, (req, res) => {
  const { messageId } = req.params;
  db.prepare('DELETE FROM contacts WHERE id = ?').run(messageId);
  res.redirect('/admin/contact-messages');
});

// Create user form
router.get('/users/create', requireAuth, requireAdmin, (req, res) => {
  res.render('admin/create-user', { errors: [] });
});

// Create user (POST)
router.post('/users/create', requireAuth, requireAdmin, (req, res) => {
  const { username, email, password, is_admin } = req.body;
  const errors = [];

  // Validation
  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters');
  }
  if (!email || !email.includes('@')) {
    errors.push('Please provide a valid email');
  }
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  // Check if user exists
  const existingUser = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
  if (existingUser) {
    errors.push('Username or email already exists');
  }

  if (errors.length > 0) {
    return res.render('admin/create-user', { 
      errors,
      data: { username, email, is_admin }
    });
  }

  // Hash password
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync(password, 10);
  const adminFlag = is_admin === 'on' ? 1 : 0;

  try {
    db.prepare('INSERT INTO users (username, email, password_hash, is_admin) VALUES (?, ?, ?, ?)').run(
      username.trim(),
      email.trim(),
      hashedPassword,
      adminFlag
    );
    res.redirect('/admin/users?success=User created successfully');
  } catch (err) {
    errors.push('Error creating user: ' + err.message);
    res.render('admin/create-user', { 
      errors,
      data: { username, email, is_admin }
    });
  }
});

module.exports = router;
