const express = require('express');
const { marked } = require('marked');
const sanitizeHtml = require('sanitize-html');
const PDFDocument = require('pdfkit');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Helper function to extract YouTube video ID from URL
function extractYouTubeVideoId(url) {
  if (!url) return null;
  
  try {
    // Handle youtube.com/watch?v=ID and youtu.be/ID formats
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  } catch (err) {
    return null;
  }
}

// Configure marked for wiki links
const renderer = new marked.Renderer();
const originalLinkRenderer = renderer.link.bind(renderer);

renderer.link = (href, title, text) => {
  // Handle wiki-style links [[Page Name]]
  if (href.startsWith('wiki:')) {
    const pageName = href.substring(5);
    const slug = pageName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return `<a href="${slug}" class="wiki-link">${text || pageName}</a>`;
  }
  return originalLinkRenderer(href, title, text);
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: true
});

// Helper to check edit permissions
function canEdit(wiki, user) {
  if (!user) return wiki.allow_public_edit;
  if (user.is_admin) return true;
  if (wiki.owner_id === user.id) return true;
  if (wiki.allow_public_edit) return true;
  
  const membership = db.prepare('SELECT role FROM wiki_members WHERE wiki_id = ? AND user_id = ?')
    .get(wiki.id, user.id);
  return membership && ['editor', 'admin'].includes(membership.role);
}

// Helper to render markdown safely
function renderMarkdown(content, wikiSlug) {
  const html = marked(content || '');
  // Update relative wiki links
  const withLinks = html.replace(/href="([^"]+)"/g, (match, href) => {
    if (!href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#')) {
      return `href="/w/${wikiSlug}/${href}"`;
    }
    return match;
  });
  return sanitizeHtml(withLinks, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'class', 'target'],
      img: ['src', 'alt', 'title']
    }
  });
}

// View page
router.get('/:wikiSlug/:pageSlug', (req, res) => {
  const { wikiSlug, pageSlug } = req.params;

  const wiki = db.prepare('SELECT * FROM wikis WHERE slug = ?').get(wikiSlug);
  if (!wiki) {
    return res.status(404).render('error', { message: 'Wiki not found', error: {} });
  }

  // Check access for private wikis
  if (!wiki.is_public && !req.session.user) {
    return res.redirect('/auth/login');
  }

  /* const page = db.prepare(`
    SELECT p.*, u.username as author, u2.username as last_editor
    FROM pages p
    JOIN users u ON p.created_by = u.id
    LEFT JOIN users u2 ON p.updated_by = u2.id
    WHERE p.wiki_id = ? AND p.slug = ?
  `).get(wiki.id, pageSlug); */

  // This SQL query doesn't work. -Rylan
  // Simplified query
  let page = db.prepare('SELECT * FROM pages WHERE wiki_id = ? AND slug = ?').get(wiki.id, pageSlug);

  // If page doesn't exist and user can edit, auto-create it
  if (!page && canEdit(wiki, req.session.user)) {
    const pageTitle = pageSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const pageContent = `# ${pageTitle}\n\nWrite your content here...`;
    
    try {
      db.prepare(`
        INSERT INTO pages (wiki_id, slug, title, content, created_by)
        VALUES (?, ?, ?, ?, ?)
      `).run(wiki.id, pageSlug, pageTitle, pageContent, req.session.user?.id || null);
      
      // Fetch the newly created page
      page = db.prepare('SELECT * FROM pages WHERE wiki_id = ? AND slug = ?').get(wiki.id, pageSlug);
    } catch (err) {
      console.error('Error auto-creating page:', err);
      // Fall back to not-found page if auto-creation fails
      return res.render('page/not-found', { 
        wiki, 
        pageSlug,
        canEdit: canEdit(wiki, req.session.user)
      });
    }
  }

  if (!page) {
    // Page doesn't exist and user cannot edit - show not-found page
    return res.render('page/not-found', { 
      wiki, 
      pageSlug,
      canEdit: canEdit(wiki, req.session.user)
    });
  }

  const renderedContent = renderMarkdown(page.content, wikiSlug);

  // Extract YouTube video ID if URL exists
  const youtubeEmbedId = wiki.youtube_url ? extractYouTubeVideoId(wiki.youtube_url) : null;

  res.render('page/view', { 
    wiki, 
    page, 
    content: renderedContent,
    canEdit: canEdit(wiki, req.session.user),
    youtube_embed_id: youtubeEmbedId
  });
});

// Edit page form
router.get('/:wikiSlug/:pageSlug/edit', (req, res) => {
  const { wikiSlug, pageSlug } = req.params;

  const wiki = db.prepare('SELECT * FROM wikis WHERE slug = ?').get(wikiSlug);
  if (!wiki) {
    return res.status(404).render('error', { message: 'Wiki not found', error: {} });
  }

  if (!canEdit(wiki, req.session.user)) {
    return res.status(403).render('error', { message: 'You do not have permission to edit this page', error: {} });
  }

  const page = db.prepare('SELECT * FROM pages WHERE wiki_id = ? AND slug = ?').get(wiki.id, pageSlug);

  res.render('page/edit', { 
    wiki, 
    page: page || { slug: pageSlug, title: pageSlug.replace(/-/g, ' '), content: '' },
    isNew: !page,
    error: null 
  });
});

// Save page
router.post('/:wikiSlug/:pageSlug/edit', (req, res) => {
  const { wikiSlug, pageSlug } = req.params;
  const { title, content, edit_summary } = req.body;

  const wiki = db.prepare('SELECT * FROM wikis WHERE slug = ?').get(wikiSlug);
  if (!wiki) {
    return res.status(404).render('error', { message: 'Wiki not found', error: {} });
  }

  if (!canEdit(wiki, req.session.user)) {
    return res.status(403).render('error', { message: 'You do not have permission to edit this page', error: {} });
  }

  const userId = req.session.user ? req.session.user.id : null;
  
  try {
    const existingPage = db.prepare('SELECT * FROM pages WHERE wiki_id = ? AND slug = ?').get(wiki.id, pageSlug);

    if (existingPage) {
      // Save revision before updating
      db.prepare(`
        INSERT INTO page_revisions (page_id, title, content, edited_by, edit_summary)
        VALUES (?, ?, ?, ?, ?)
      `).run(existingPage.id, existingPage.title, existingPage.content, userId, edit_summary || '');

      // Update page
      db.prepare(`
        UPDATE pages 
        SET title = ?, content = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(title, content, userId, existingPage.id);
    } else {
      // Create new page
      db.prepare(`
        INSERT INTO pages (wiki_id, slug, title, content, created_by)
        VALUES (?, ?, ?, ?, ?)
      `).run(wiki.id, pageSlug, title, content, userId);
    }

    res.redirect(`/w/${wikiSlug}/${pageSlug}`);
  } catch (err) {
    console.error(err);
    res.render('page/edit', { 
      wiki, 
      page: { slug: pageSlug, title, content },
      isNew: !db.prepare('SELECT 1 FROM pages WHERE wiki_id = ? AND slug = ?').get(wiki.id, pageSlug),
      error: 'Failed to save page' 
    });
  }
});

// Page history
router.get('/:wikiSlug/:pageSlug/history', (req, res) => {
  const { wikiSlug, pageSlug } = req.params;

  const wiki = db.prepare('SELECT * FROM wikis WHERE slug = ?').get(wikiSlug);
  if (!wiki) {
    return res.status(404).render('error', { message: 'Wiki not found', error: {} });
  }

  const page = db.prepare('SELECT * FROM pages WHERE wiki_id = ? AND slug = ?').get(wiki.id, pageSlug);
  if (!page) {
    return res.status(404).render('error', { message: 'Page not found', error: {} });
  }

  const revisions = db.prepare(`
    SELECT pr.*, u.username as editor
    FROM page_revisions pr
    LEFT JOIN users u ON pr.edited_by = u.id
    WHERE pr.page_id = ?
    ORDER BY pr.created_at DESC
  `).all(page.id);

  res.render('page/history', { wiki, page, revisions });
});

// View specific revision
router.get('/:wikiSlug/:pageSlug/revision/:revisionId', (req, res) => {
  const { wikiSlug, pageSlug, revisionId } = req.params;

  const wiki = db.prepare('SELECT * FROM wikis WHERE slug = ?').get(wikiSlug);
  if (!wiki) {
    return res.status(404).render('error', { message: 'Wiki not found', error: {} });
  }

  const page = db.prepare('SELECT * FROM pages WHERE wiki_id = ? AND slug = ?').get(wiki.id, pageSlug);
  if (!page) {
    return res.status(404).render('error', { message: 'Page not found', error: {} });
  }

  const revision = db.prepare(`
    SELECT pr.*, u.username as editor
    FROM page_revisions pr
    LEFT JOIN users u ON pr.edited_by = u.id
    WHERE pr.id = ? AND pr.page_id = ?
  `).get(revisionId, page.id);

  if (!revision) {
    return res.status(404).render('error', { message: 'Revision not found', error: {} });
  }

  const renderedContent = renderMarkdown(revision.content, wikiSlug);

  res.render('page/revision', { wiki, page, revision, content: renderedContent });
});

// Export page as PDF
router.get('/:wikiSlug/:pageSlug/export/pdf', (req, res) => {
  const { wikiSlug, pageSlug } = req.params;

  const wiki = db.prepare('SELECT * FROM wikis WHERE slug = ?').get(wikiSlug);
  if (!wiki) {
    return res.status(404).render('error', { message: 'Wiki not found', error: {} });
  }

  // Check access for private wikis
  if (!wiki.is_public && !req.session.user) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const page = db.prepare('SELECT * FROM pages WHERE wiki_id = ? AND slug = ?').get(wiki.id, pageSlug);
  if (!page) {
    return res.status(404).json({ error: 'Page not found' });
  }

  try {
    // Create PDF document
    const doc = new PDFDocument({
      bufferPages: true,
      margin: 50
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pageSlug}.pdf"`);

    // Pipe PDF to response
    doc.pipe(res);

    // Add title
    doc.fontSize(24).font('Helvetica-Bold').text(page.title, { align: 'left' });
    
    // Add wiki and page info
    doc.fontSize(10).font('Helvetica').fillColor('#666666');
    doc.text(`Wiki: ${wiki.name}`, { align: 'left' });
    doc.text(`Created: ${new Date(page.created_at).toLocaleDateString()}`, { align: 'left' });
    if (page.updated_at && page.updated_at !== page.created_at) {
      doc.text(`Updated: ${new Date(page.updated_at).toLocaleDateString()}`, { align: 'left' });
    }
    
    // Add spacing
    doc.moveDown(0.5);
    doc.strokeColor('#CCCCCC').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.5);

    // Convert markdown to plain text (basic conversion)
    const plainText = page.content
      .replace(/^### (.*?)$/gm, '$1')
      .replace(/^## (.*?)$/gm, '$1')
      .replace(/^# (.*?)$/gm, '$1')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/---/g, '');

    // Add content
    doc.fontSize(11).font('Helvetica').fillColor('#000000');
    doc.text(plainText, {
      align: 'left',
      width: 445,
      lineGap: 5
    });

    // Add footer
    doc.fontSize(9).font('Helvetica').fillColor('#999999');
    doc.moveDown(1);
    doc.text(`Exported from Wiki Farm on ${new Date().toLocaleString()}`, { align: 'center' });

    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error('PDF export error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Delete page
router.post('/:wikiSlug/:pageSlug/delete', requireAuth, (req, res) => {
  const { wikiSlug, pageSlug } = req.params;

  const wiki = db.prepare('SELECT * FROM wikis WHERE slug = ?').get(wikiSlug);
  if (!wiki) {
    return res.status(404).render('error', { message: 'Wiki not found', error: {} });
  }

  // Only wiki owner or admin can delete pages
  if (wiki.owner_id !== req.session.user.id && !req.session.user.is_admin) {
    return res.status(403).render('error', { message: 'Access denied', error: {} });
  }

  db.prepare('DELETE FROM pages WHERE wiki_id = ? AND slug = ?').run(wiki.id, pageSlug);
  res.redirect(`/w/${wikiSlug}/pages`);
});

module.exports = router;
