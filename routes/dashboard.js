const express = require('express');
const router = express.Router();
const SystemMetrics = require('../utils/systemMetrics');
const HealthCheck = require('../utils/healthCheck');

router.get('/api/dashboard/metrics', async (req, res) => {
  try {
    const metrics = await SystemMetrics.getDetailedMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/api/dashboard/health', async (req, res) => {
  try {
    const health = await HealthCheck.runChecks();
    res.json(health);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;