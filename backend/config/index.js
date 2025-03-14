const development = require('./development');
const production = require('./production');

const env = process.env.NODE_ENV || 'development';
const configs = {
  development,
  production
};

const config = configs[env];

// Add backup configuration
config.backup = {
  schedule: '0 0 * * *',
  retention: 7,
  path: './backups'
};

// Add rate limiting configuration
config.rateLimit = {
  chat: {
    windowMs: 15 * 60 * 1000,
    max: env === 'production' ? 100 : 1000
  },
  auth: {
    windowMs: 60 * 60 * 1000,
    max: env === 'production' ? 5 : 20
  }
};

// Add security configuration
config.security = {
  cors: {
    origin: env === 'production' ? 'https://your-domain.com' : 'http://localhost:3000',
    credentials: true
  },
  jwt: {
    expiresIn: '24h',
    cookieOptions: {
      httpOnly: true,
      secure: env === 'production',
      sameSite: 'strict'
    }
  }
};

// Add logging configuration
config.logging = {
  level: env === 'production' ? 'info' : 'debug',
  maxFiles: 5,
  maxSize: '10m',
  path: './logs',
  format: {
    timestamp: true,
    json: true
  }
};

// Add restore configuration
config.restore = {
  allowedEnvironments: ['development'], // Prevent restores in production
  maxBackupSize: 100 * 1024 * 1024, // 100MB
  timeout: 300000 // 5 minutes
};

module.exports = config;
