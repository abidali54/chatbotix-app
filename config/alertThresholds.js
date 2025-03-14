const thresholds = {
  cpu: {
    warning: 80,
    critical: 90,
    duration: 300, // seconds
    samples: 5
  },
  memory: {
    warning: 85,
    critical: 95,
    leakRate: 100 // MB per hour
  },
  disk: {
    warning: 85,
    critical: 95,
    growthRate: 1 // GB per day
  },
  database: {
    connectionTimeout: 5000,
    queryTimeout: 10000,
    maxConnections: 100
  },
  api: {
    responseTime: {
      warning: 1000,
      critical: 5000
    },
    errorRate: {
      warning: 5,
      critical: 10
    }
  }
};

module.exports = thresholds;