module.exports = {
  database: {
    url: process.env.DATABASE_URL,
  },
  server: {
    port: process.env.PORT || 3001,
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h'
  }
};