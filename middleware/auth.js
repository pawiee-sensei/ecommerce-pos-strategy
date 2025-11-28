// middleware/auth.js

/**
 * Authentication middlewares.
 *
 * - ensureAuthenticated: allows only logged-in users (redirects to /login or returns 401 for XHR)
 * - ensureAdmin: allows only users with role === 'admin'
 *
 * These middlewares expect that on successful login you set:
 *    req.session.user = { id, username, role }
 */

const ensureAuthenticated = (options = {}) => {
  // options:
  //  - redirectTo (string | false) default '/login' (if false, returns 401 for non-html)
  const {
    redirectTo = '/login'
  } = options;

  return (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    }

    // If request expects HTML and redirectTo is configured, redirect
    if (redirectTo && req.accepts('html')) {
      return res.redirect(redirectTo);
    }

    // For XHR / JSON, return 401 JSON
    if (req.accepts('json')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.status(401).send('Unauthorized');
  };
};

const ensureAdmin = () => {
  return (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
      return next();
    }

    // If HTML, redirect to dashboard or login
    if (req.accepts('html')) {
      // If logged in but not admin, send 403 page if exists
      if (req.session && req.session.user) {
        return res.status(403).render('errors/403', { session: req.session });
      }
      return res.redirect('/login');
    }

    if (req.accepts('json')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return res.status(403).send('Forbidden');
  };
};

module.exports = {
  ensureAuthenticated,
  ensureAdmin
};
