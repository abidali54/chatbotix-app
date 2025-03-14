const deploy = {
  app: {
    name: 'chatbotix',
  },
  
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306
  }
};

module.exports = deploy;

