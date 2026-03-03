const express = require('express');
const db = require('../db/database');
const { requireAuth, requireWikiAccess } = require('../middleware/auth');
const { stripHtmlTags, sanitizeInput, isSuspiciousInput } = require('../utils/security');

const router = express.Router();

// Helper function to extract YouTube video ID from URL
function extractYouTubeVideoId(url) {
  if (!url) return null;
  
  try {
    // Handle youtube.com/watch?v=ID format
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  } catch (err) {
    return null;
  }
}

// Helper function to get embed URL from YouTube URL
function getYouTubeEmbedUrl(youtubeUrl) {
  const videoId = extractYouTubeVideoId(youtubeUrl);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

// Create wiki form
router.get('/create', requireAuth, (req, res) => {
  res.render('wiki/create', { error: null });
});

// Create wiki handler
router.post('/create', requireAuth, (req, res) => {
  const { name, slug, description, youtube_url, is_public, allow_public_edit } = req.body;

  // Sanitize inputs to prevent XSS and HTML injection
  const sanitizedName = stripHtmlTags(sanitizeInput(name || '')).trim();
  const sanitizedSlug = stripHtmlTags(sanitizeInput(slug || '')).trim();
  const sanitizedDescription = stripHtmlTags(sanitizeInput(description || '')).trim();
  const sanitizedYoutubeUrl = sanitizeInput(youtube_url || '').trim();

  // Check for suspicious input patterns
  if (isSuspiciousInput(sanitizedName) || isSuspiciousInput(sanitizedDescription)) {
    return res.render('wiki/create', { error: 'Input contains suspicious patterns. Please remove any HTML, JavaScript, or SQL keywords.' });
  }

  // Validation
  if (!sanitizedName || !sanitizedSlug) {
    return res.render('wiki/create', { error: 'Name and slug are required' });
  }

  if (sanitizedName.length < 3) {
    return res.render('wiki/create', { error: 'Wiki name must be at least 3 characters' });
  }

  if (!/^[a-z0-9-]+$/.test(sanitizedSlug)) {
    return res.render('wiki/create', { error: 'Slug can only contain lowercase letters, numbers, and hyphens' });
  }

  if (sanitizedSlug.length < 3) {
    return res.render('wiki/create', { error: 'Slug must be at least 3 characters' });
  }

  // Check if slug exists
  const existingWiki = db.prepare('SELECT id FROM wikis WHERE slug = ?').get(sanitizedSlug);
  if (existingWiki) {
    return res.render('wiki/create', { error: 'A wiki with this slug already exists' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO wikis (slug, name, description, youtube_url, owner_id, is_public, allow_public_edit)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(sanitizedSlug, sanitizedName, sanitizedDescription, sanitizedYoutubeUrl || null, req.session.user.id, is_public ? 1 : 0, allow_public_edit ? 1 : 0);

    // Create a default home page
    const welcomeContent = `# Welcome to ${sanitizedName}\n\nThis is your wiki's home page. Click **Edit** to customize it!`;
    db.prepare(`
      INSERT INTO pages (wiki_id, slug, title, content, created_by)
      VALUES (?, 'home', 'Welcome', ?, ?)
    `).run(result.lastInsertRowid, welcomeContent, req.session.user.id);

    res.redirect(`/w/${sanitizedSlug}`);
  } catch (err) {
    console.error(err);
    res.render('wiki/create', { error: 'Failed to create wiki' });
  }
});

// View wiki home page
router.get('/:wikiSlug', (req, res) => {
  const { wikiSlug } = req.params;

  const wiki = db.prepare('SELECT * FROM wikis WHERE slug = ?').get(wikiSlug);
  if (!wiki) {
    return res.status(404).render('error', { message: 'Wiki not found', error: {} });
  }

  // Check access for private wikis
  if (!wiki.is_public) {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }
    const isMember = db.prepare(`
      SELECT 1 FROM wiki_members WHERE wiki_id = ? AND user_id = ?
      UNION SELECT 1 FROM wikis WHERE id = ? AND owner_id = ?
    `).get(wiki.id, req.session.user.id, wiki.id, req.session.user.id);
    
    if (!isMember && !req.session.user.is_admin) {
      return res.status(403).render('error', { message: 'Access denied', error: {} });
    }
  }

  // Redirect to home page
  res.redirect(`/w/${wikiSlug}/home`);
});

// Wiki settings
router.get('/:wikiSlug/settings', requireAuth, (req, res) => {
  const { wikiSlug } = req.params;
  
  const wiki = db.prepare('SELECT * FROM wikis WHERE slug = ?').get(wikiSlug);
  if (!wiki) {
    return res.status(404).render('error', { message: 'Wiki not found', error: {} });
  }

  // Check ownership
  if (wiki.owner_id !== req.session.user.id && !req.session.user.is_admin) {
    return res.status(403).render('error', { message: 'Access denied', error: {} });
  }

  const members = db.prepare(`
    SELECT wm.*, u.username 
    FROM wiki_members wm 
    JOIN users u ON wm.user_id = u.id 
    WHERE wm.wiki_id = ?
  `).all(wiki.id);

  res.render('wiki/settings', { wiki, members, error: null, success: null });
});

// Update wiki settings
router.post('/:wikiSlug/settings', requireAuth, (req, res) => {
  const { wikiSlug } = req.params;
  const { name, description, is_public, allow_public_edit } = req.body;

  const wiki = db.prepare('SELECT * FROM wikis WHERE slug = ?').get(wikiSlug);
  if (!wiki) {
    return res.status(404).render('error', { message: 'Wiki not found', error: {} });
  }

  if (wiki.owner_id !== req.session.user.id && !req.session.user.is_admin) {
    return res.status(403).render('error', { message: 'Access denied', error: {} });
  }

  try {
    db.prepare(`
      UPDATE wikis 
      SET name = ?, description = ?, is_public = ?, allow_public_edit = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description || '', is_public ? 1 : 0, allow_public_edit ? 1 : 0, wiki.id);

    const members = db.prepare(`
      SELECT wm.*, u.username 
      FROM wiki_members wm 
      JOIN users u ON wm.user_id = u.id 
      WHERE wm.wiki_id = ?
    `).all(wiki.id);

    res.render('wiki/settings', { 
      wiki: { ...wiki, name, description, is_public: is_public ? 1 : 0, allow_public_edit: allow_public_edit ? 1 : 0 },
      members,
      error: null, 
      success: 'Settings updated successfully' 
    });
  } catch (err) {
    console.error(err);
    res.render('wiki/settings', { wiki, members: [], error: 'Failed to update settings', success: null });
  }
});

// Add member to wiki
router.post('/:wikiSlug/members', requireAuth, (req, res) => {
  const { wikiSlug } = req.params;
  const { username, role } = req.body;

  const wiki = db.prepare('SELECT * FROM wikis WHERE slug = ?').get(wikiSlug);
  if (!wiki || (wiki.owner_id !== req.session.user.id && !req.session.user.is_admin)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const user = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  try {
    db.prepare(`
      INSERT OR REPLACE INTO wiki_members (wiki_id, user_id, role)
      VALUES (?, ?, ?)
    `).run(wiki.id, user.id, role || 'editor');

    res.redirect(`/w/${wikiSlug}/settings`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// List all pages in wiki
router.get('/:wikiSlug/pages', (req, res) => {
  const { wikiSlug } = req.params;

  const wiki = db.prepare('SELECT * FROM wikis WHERE slug = ?').get(wikiSlug);
  if (!wiki) {
    return res.status(404).render('error', { message: 'Wiki not found', error: {} });
  }

  const pages = db.prepare(`
    SELECT p.*, u.username as author
    FROM pages p
    JOIN users u ON p.created_by = u.id
    WHERE p.wiki_id = ?
    ORDER BY p.title ASC
  `).all(wiki.id);

  res.render('wiki/pages', { wiki, pages });
});

// Delete wiki
router.post('/:wikiSlug/delete', requireAuth, (req, res) => {
  const { wikiSlug } = req.params;

  const wiki = db.prepare('SELECT * FROM wikis WHERE slug = ?').get(wikiSlug);
  if (!wiki) {
    return res.status(404).render('error', { message: 'Wiki not found', error: {} });
  }

  if (wiki.owner_id !== req.session.user.id && !req.session.user.is_admin) {
    return res.status(403).render('error', { message: 'Access denied', error: {} });
  }

  db.prepare('DELETE FROM wikis WHERE id = ?').run(wiki.id);
  res.redirect('/');
});

module.exports = router;
