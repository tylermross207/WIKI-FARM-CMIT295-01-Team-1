const express = require('express');
const router = express.Router();

// Create wiki form
router.get('/create-wiki', (req, res) => {
  res.render('wiki/create-wiki');
});

// What is a Wiki page
router.get('/what-is-a-wiki', (req, res) => {
  res.render('wiki/what-is-a-wiki');
});

// Other routes

module.exports = router;