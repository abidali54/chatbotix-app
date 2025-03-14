const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const { pool } = require('./database');

const sessionConfig = session({
  store: new PgSession({
    pool,
    tableName: 'user_sessions'
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
});

module.exports = sessionConfig;