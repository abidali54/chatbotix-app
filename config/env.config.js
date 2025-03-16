const environments = {
  development: {
    apiUrl: 'http://localhost:3000',
    wsUrl: 'ws://localhost:3001',
    mlModelPath: './models/dev'
  },
  staging: {
    apiUrl: 'https://staging-api.chatbotix.com',
    wsUrl: 'wss://staging-ws.chatbotix.com',
    mlModelPath: './models/staging'
  },
  production: {
    apiUrl: 'https://api.chatbotix.com',
    wsUrl: 'wss://ws.chatbotix.com',
    mlModelPath: './models/prod'
  }
};

module.exports = environments[process.env.NODE_ENV || 'development'];