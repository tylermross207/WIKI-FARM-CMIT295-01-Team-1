const express = require('express');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Available themes with their CSS variables
const THEMES = {
  burgundy: {
    name: 'Burgundy (Default)',
    primary: '#5b0b0b',
    primaryDark: '#3a0303',
    primaryLight: '#f3e8e8',
    accent: '#8b2b2b',
    danger: '#a71d2a',
    text: '#2d1b1b',
    textMuted: '#6b4b4b',
    border: '#e6d9cf',
    bg: '#fbf2e6'
  },
  ocean: {
    name: 'Ocean Blue',
    primary: '#0066cc',
    primaryDark: '#004499',
    primaryLight: '#e6f2ff',
    accent: '#0099ff',
    danger: '#ff3333',
    text: '#1a1a2e',
    textMuted: '#666699',
    border: '#ccddff',
    bg: '#f5f9ff'
  },
  forest: {
    name: 'Forest Green',
    primary: '#1b5e20',
    primaryDark: '#0d3818',
    primaryLight: '#e8f5e9',
    accent: '#2e7d32',
    danger: '#c62828',
    text: '#1b5e20',
    textMuted: '#558b2f',
    border: '#c8e6c9',
    bg: '#f1f8e9'
  },
  sunset: {
    name: 'Sunset Orange',
    primary: '#e65100',
    primaryDark: '#bf360c',
    primaryLight: '#ffe0b2',
    accent: '#ff6f00',
    danger: '#d32f2f',
    text: '#bf360c',
    textMuted: '#e65100',
    border: '#ffe0b2',
    bg: '#fff3e0'
  },
  purple: {
    name: 'Purple Royale',
    primary: '#6a1b9a',
    primaryDark: '#4a148c',
    primaryLight: '#f3e5f5',
    accent: '#9c27b0',
    danger: '#e91e63',
    text: '#4a148c',
    textMuted: '#7b1fa2',
    border: '#e1bee7',
    bg: '#faf5ff'
  },
  slate: {
    name: 'Slate Gray',
    primary: '#37474f',
    primaryDark: '#1c1f26',
    primaryLight: '#eceff1',
    accent: '#546e7a',
    danger: '#d32f2f',
    text: '#1c1f26',
    textMuted: '#455a64',
    border: '#b0bec5',
    bg: '#f5f6f7'
  }
};

// Get user settings page
router.get('/preferences', requireAuth, (req, res) => {
  const userId = req.session.user.id;
  
  // Get user's current theme preference
  const prefs = db.prepare('SELECT theme_name FROM user_preferences WHERE user_id = ?').get(userId);
  const currentTheme = prefs?.theme_name || 'burgundy';
  
  res.render('settings/preferences', {
    currentTheme,
    themes: THEMES,
    error: null,
    success: null
  });
});

// Update theme preference
router.post('/preferences/theme', requireAuth, (req, res) => {
  const userId = req.session.user.id;
  const { theme } = req.body;
  
  // Validate theme
  if (!THEMES[theme]) {
    return res.render('settings/preferences', {
      currentTheme: theme,
      themes: THEMES,
      error: 'Invalid theme selected',
      success: null
    });
  }
  
  try {
    // Check if preferences exist
    const existing = db.prepare('SELECT id FROM user_preferences WHERE user_id = ?').get(userId);
    
    if (existing) {
      // Update existing
      db.prepare('UPDATE user_preferences SET theme_name = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?')
        .run(theme, userId);
    } else {
      // Create new
      db.prepare('INSERT INTO user_preferences (user_id, theme_name) VALUES (?, ?)')
        .run(userId, theme);
    }
    
    // Update session to include theme
    req.session.user.theme = theme;
    
    res.render('settings/preferences', {
      currentTheme: theme,
      themes: THEMES,
      error: null,
      success: `Theme changed to ${THEMES[theme].name}!`
    });
  } catch (err) {
    console.error(err);
    res.render('settings/preferences', {
      currentTheme: theme,
      themes: THEMES,
      error: 'Failed to update theme preference',
      success: null
    });
  }
});

module.exports = router;
module.exports.THEMES = THEMES;
