const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /contact - Display contact form
router.get('/', (req, res) => {
  res.render('contact', { success: false, data: {}, errors: [] });
});

// POST /contact - Handle form submission
router.post('/', (req, res) => {
  const { name, email, message } = req.body;
  const errors = [];

  // Server-side validation
  if (!name || name.trim().length < 2) {
    errors.push('Please provide your name (at least 2 characters).');
  }
  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Please provide a valid email address.');
  }
  if (!message || message.trim().length < 10) {
    errors.push('Please enter a message (at least 10 characters).');
  }

  // If there are validation errors, re-render form with errors
  if (errors.length > 0) {
    return res.render('contact', {
      success: false,
      data: { name: name || '', email: email || '', message: message || '' },
      errors
    });
  }

  // Save the contact message to the database
  try {
    db.prepare(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)'
    ).run(name.trim(), email.trim(), message.trim());

    // Render success page
    return res.render('contact', {
      success: true,
      data: { name: name.trim() },
      errors: []
    });
  } catch (err) {
    console.error('Error saving contact message:', err);
    errors.push('An unexpected error occurred. Please try again later.');
    return res.render('contact', {
      success: false,
      data: { name: name || '', email: email || '', message: message || '' },
      errors
    });
  }
});

module.exports = router;
