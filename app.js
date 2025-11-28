// app.js
require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

const {
  PORT = 3000,
  NODE_ENV = 'development',
  SESSION_SECRET = 'change_this_to_a_strong_secret',
  SESSION_COOKIE_NAME = 'session_id',
  SESSION_MAX_AGE = 86400000
} = process.env;

/* ==========================================================
   ✓ FIX: ENABLE HELMET BUT ALLOW INLINE SCRIPTS FOR EJS
   ========================================================== */
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // allow inline scripts (needed for your sidebar toggle)
        "script-src": ["'self'", "'unsafe-inline'"],

        // allow inline styles
        "style-src": ["'self'", "'unsafe-inline'"],

        // allow EJS AJAX loading
        "connect-src": ["'self'"]
      }
    },

    // fixes issues with cross-origin requests
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

/* ========================================================== */

app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Sessions
app.use(
  session({
    name: SESSION_COOKIE_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: Number(SESSION_MAX_AGE),
      httpOnly: true,
      sameSite: 'lax',
      secure: NODE_ENV === 'production'
    }
  })
);

// Make session available to all views
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.session?.user || null;
  next();
});

// Routes
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const adminPanelsRouter = require('./routes/adminPanels');

app.use('/', authRouter);
app.use('/admin', adminRouter);
app.use('/admin/panels', adminPanelsRouter);

// Ping
app.get('/ping', (req, res) => res.json({ ok: true, env: NODE_ENV }));

// 404
app.use((req, res) => {
  if (req.accepts('html')) {
    return res.status(404).render('errors/404', { url: req.originalUrl });
  }
  if (req.accepts('json')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(404).type('txt').send('Not found');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;

  if (req.accepts('html')) {
    return res.status(status).render('errors/500', { error: err });
  }
  if (req.accepts('json')) {
    return res.status(status).json({ error: err.message });
  }
  res.status(status).send(err.message);
});

// Start server
if (require.main === module) {
  const port = Number(PORT);
  app.listen(port, () => {
    console.log(`Server listening on port ${port} (env: ${NODE_ENV})`);
  });
}

module.exports = app;
