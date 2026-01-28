// Authentication middleware

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || !req.session.user.is_admin) {
    return res.status(403).render('error', { 
      message: 'Access denied. Admin privileges required.',
      error: {}
    });
  }
  next();
}

function requireWikiAccess(req, res, next) {
  const db = require('../db/database');
  const { wikiSlug } = req.params;

  const wiki = db.prepare('SELECT * FROM wikis WHERE slug = ?').get(wikiSlug);
  if (!wiki) {
    return res.status(404).render('error', { message: 'Wiki not found', error: {} });
  }

  // Public wikis are accessible to everyone
  if (wiki.is_public) {
    req.wiki = wiki;
    return next();
  }

  // Private wikis require authentication
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  // Check if user is owner, admin, or member
  if (wiki.owner_id === req.session.user.id || req.session.user.is_admin) {
    req.wiki = wiki;
    return next();
  }

  const membership = db.prepare('SELECT * FROM wiki_members WHERE wiki_id = ? AND user_id = ?')
    .get(wiki.id, req.session.user.id);

  if (!membership) {
    return res.status(403).render('error', { message: 'Access denied', error: {} });
  }

  req.wiki = wiki;
  req.wikiMembership = membership;
  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  requireWikiAccess
};
