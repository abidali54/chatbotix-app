const express = require('express');
const router = express.Router();
const monitor = require('../utils/monitor');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Get system metrics
    const metrics = {
      uptime: process.uptime(),
      timestamp: Date.now(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    };

    res.json({
      status: 'healthy',
      metrics
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

module.exports = router;