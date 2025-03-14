const config = {
  development: {
    APP_URL: 'http://localhost:3000',
    API_URL: 'http://localhost:5000',
    DATABASE_URL: process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/chatbotix',
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    SMTP_PORT: process.env.SMTP_PORT || 2525,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
    CORS_ORIGIN: 'http://localhost:3000',
    LOG_LEVEL: 'debug'
  },
  
  production: {
    APP_URL: process.env.APP_URL,
    API_URL: process.env.API_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    LOG_LEVEL: 'error',
    RATE_LIMIT: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    },
    CACHE: {
      ttl: 60 * 60 * 1000, // 1 hour
      max: 1000 // maximum size of the cache
    },
    SSL: {
      enabled: true,
      key: process.env.SSL_KEY_PATH,
      cert: process.env.SSL_CERT_PATH
    }
  }
};

const env = process.env.NODE_ENV || 'development';

if (!config[env]) {
  throw new Error(`Invalid environment: ${env}`);
}

if (env === 'production') {
  const requiredVars = [
    'APP_URL',
    'DATABASE_URL',
    'JWT_SECRET',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASSWORD'
  ];

  const missing = requiredVars.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

module.exports = config[env];