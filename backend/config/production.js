module.exports = {
  database: {
    url: process.env.DATABASE_URL,
  },
  server: {
    port: process.env.PORT || 3001,
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d'
  }
};