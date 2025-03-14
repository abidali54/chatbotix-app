const express = require('express');
const router = express.Router();
const monitor = require('./monitor');
const alerts = require('./alerts');

router.get('/dashboard', async (req, res) => {
  const metrics = {
    system: {
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      uptime: process.uptime()
    },
    performance: await monitor.getPerformanceMetrics(),
    alerts: await alerts.getRecentAlerts(),
    database: await monitor.getDatabaseMetrics()
  };

  res.json(metrics);
});

module.exports = router;