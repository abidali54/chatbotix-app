const deployConfig = {
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  
  server: {
    domain: process.env.DOMAIN,
    ssl: {
      enabled: true,
      cert: '/path/to/cert.pem',
      key: '/path/to/key.pem'
    }
  },
  
  email: {
    from: 'noreply@yourdomain.com',
    replyTo: 'support@yourdomain.com'
  },
  
  security: {
    maxLoginAttempts: 5,
    lockoutTime: 15, // minutes
    sessionTimeout: 24 // hours
  }
};

module.exports = deployConfig;