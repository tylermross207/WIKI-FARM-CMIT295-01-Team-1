const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const db = require('../db/database');
const { requireAuth, requireWikiAccess } = require('../middleware/auth');
const { stripHtmlTags, sanitizeInput, isSuspiciousInput } = require('../utils/security');

const router = express.Router();

// Configure multer for file uploads - use persistent storage on Render
let uploadsDir;
if (process.env.RENDER) {
  // On Render, store uploads in the persistent disk mounted at /opt/render/project/.data
  uploadsDir = path.join('/opt/render/project/.data', 'uploads');
} else {
  // Locally, use the src/public/uploads directory
  uploadsDir = path.join(__dirname, '../public/uploads');
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'wiki-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Only allow image files
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

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
router.get('/create', (req, res) => {
  res.render('wiki/create', { error: null, user: req.session.user });
});

// Create wiki handler
router.post('/create', upload.single('wiki_image'), async (req, res) => {
  const { name, slug, description, youtube_url, is_public, allow_public_edit, pageOption, firstPageTitle, firstPageContent, username, email } = req.body;

  // Sanitize inputs to prevent XSS and HTML injection
  const sanitizedName = stripHtmlTags(sanitizeInput(name || '')).trim();
  const sanitizedSlug = stripHtmlTags(sanitizeInput(slug || '')).trim();
  const sanitizedDescription = stripHtmlTags(sanitizeInput(description || '')).trim();
  const sanitizedYoutubeUrl = sanitizeInput(youtube_url || '').trim();
  const sanitizedPageOption = stripHtmlTags(sanitizeInput(pageOption || '')).trim();
  const sanitizedFirstPageTitle = stripHtmlTags(sanitizeInput(firstPageTitle || '')).trim();
  const sanitizedFirstPageContent = sanitizeInput(firstPageContent || '').trim();
  const sanitizedUsername = stripHtmlTags(sanitizeInput(username || '')).trim();
  const sanitizedEmail = stripHtmlTags(sanitizeInput(email || '')).trim();

  // Handle unauthenticated users - require username and email
  let userId = req.session.user?.id;

  // Debug logging
  console.log('[Wiki Create] req.session.user:', req.session.user);
  console.log('[Wiki Create] userId:', userId, '| Type:', typeof userId);
  console.log('[Wiki Create] Form username:', username, '| Form email:', email);
  console.log('[Wiki Create] Sanitized username:', sanitizedUsername, '| Sanitized email:', sanitizedEmail);

  // Only check username/email if user is NOT logged in
  if (!userId) {
    console.log('[Wiki Create] No userId detected - checking username/email from form');
    // Unauthenticated user MUST provide username and email
    if (!sanitizedUsername || !sanitizedEmail) {
      console.log('[Wiki Create] Username or email missing - returning error');
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.render('wiki/create', { error: 'Please provide a username and email to create a wiki', user: req.session.user });
    }

    // Validate username format
    if (sanitizedUsername.length < 3) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.render('wiki/create', { error: 'Username must be at least 3 characters', user: req.session.user });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.render('wiki/create', { error: 'Please provide a valid email address', user: req.session.user });
    }

    // Check if username already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(sanitizedUsername);
    if (existingUser) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.render('wiki/create', { error: 'This username is already taken', user: req.session.user });
    }

    // Check if email already exists
    const existingEmail = db.prepare('SELECT id FROM users WHERE email = ?').get(sanitizedEmail);
    if (existingEmail) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.render('wiki/create', { error: 'This email is already registered', user: req.session.user });
    }

    // Create a temporary account for the user
    try {
      const hashedPassword = await bcrypt.hash('TempPassword123!', 10);
      const result = db.prepare(`
        INSERT INTO users (username, email, password_hash, is_admin)
        VALUES (?, ?, ?, ?)
      `).run(sanitizedUsername, sanitizedEmail, hashedPassword, 0);
      
      userId = result.lastInsertRowid;

      // Log them in immediately
      req.session.user = {
        id: userId,
        username: sanitizedUsername,
        email: sanitizedEmail,
        is_admin: 0
      };
    } catch (err) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error('User creation error:', err);
      return res.render('wiki/create', { error: 'Failed to create user account: ' + err.message, user: req.session.user });
    }
  } else {
    console.log('[Wiki Create] User IS logged in (userId=' + userId + ') - skipping username/email validation');
  }

  // Validate page option is selected
  if (!sanitizedPageOption || (sanitizedPageOption !== 'new' && sanitizedPageOption !== 'home')) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.render('wiki/create', { error: 'You must select a page option (Create new or use default home page)', user: req.session.user });
  }

  // If creating new page, validate title
  if (sanitizedPageOption === 'new' && !sanitizedFirstPageTitle) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.render('wiki/create', { error: 'Please enter a title for the new page', user: req.session.user });
  }

  // Check for suspicious input patterns
  if (isSuspiciousInput(sanitizedName) || isSuspiciousInput(sanitizedDescription) || isSuspiciousInput(sanitizedFirstPageTitle)) {
    // Delete uploaded file if it exists
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.render('wiki/create', { error: 'Input contains suspicious patterns. Please remove any HTML, JavaScript, or SQL keywords.', user: req.session.user });
  }

  // Validation
  if (!sanitizedName || !sanitizedSlug) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.render('wiki/create', { error: 'Name and slug are required', user: req.session.user });
  }

  if (sanitizedName.length < 3) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.render('wiki/create', { error: 'Wiki name must be at least 3 characters', user: req.session.user });
  }

  if (!/^[a-z0-9-]+$/.test(sanitizedSlug)) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.render('wiki/create', { error: 'Slug can only contain lowercase letters, numbers, and hyphens', user: req.session.user });
  }

  if (sanitizedSlug.length < 3) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.render('wiki/create', { error: 'Slug must be at least 3 characters', user: req.session.user });
  }

  // Check if slug exists
  const existingWiki = db.prepare('SELECT id FROM wikis WHERE slug = ?').get(sanitizedSlug);
  if (existingWiki) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.render('wiki/create', { error: 'A wiki with this slug already exists', user: req.session.user });
  }

  try {
    // Store the image path relative to public folder
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const result = db.prepare(`
      INSERT INTO wikis (slug, name, description, youtube_url, wiki_image_path, owner_id, is_public, allow_public_edit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(sanitizedSlug, sanitizedName, sanitizedDescription, sanitizedYoutubeUrl || null, imagePath, userId, is_public ? 1 : 0, allow_public_edit ? 1 : 0);

    const wikiId = result.lastInsertRowid;

    // Create a default home page
    const welcomeContent = `# Welcome to ${sanitizedName}\n\nThis is your wiki's home page. Click **Edit** to customize it!`;
    db.prepare(`
      INSERT INTO pages (wiki_id, slug, title, content, created_by)
      VALUES (?, 'home', 'Welcome', ?, ?)
    `).run(wikiId, welcomeContent, userId);

    // Handle page option
    if (sanitizedPageOption === 'new') {
      // Generate slug from title
      const firstPageSlug = sanitizedFirstPageTitle
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      db.prepare(`
        INSERT INTO pages (wiki_id, slug, title, content, created_by)
        VALUES (?, ?, ?, ?, ?)
      `).run(wikiId, firstPageSlug, sanitizedFirstPageTitle, sanitizedFirstPageContent, req.session.user.id);

      // Redirect to the new page
      res.redirect(`/w/${sanitizedSlug}/${firstPageSlug}`);
    } else {
      // Use default home page
      res.redirect(`/w/${sanitizedSlug}/home`);
    }
  } catch (err) {
    // Delete uploaded file if it exists
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
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

   const homePage = db.prepare(
    'SELECT * FROM pages WHERE wiki_id = ? AND slug = ?'
  ).get(wiki.id, 'home');

  if (!homePage) {
    return res.redirect(`/w/${wikiSlug}/home/edit`);
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
