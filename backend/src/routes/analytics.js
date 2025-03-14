const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../middleware/auth');

// Get overall platform analytics
router.get('/overview', auth, async (req, res) => {
  try {
    const [messageCount, userCount, activeChats] = await Promise.all([
      prisma.message.count(),
      prisma.user.count(),
      prisma.chat.count({
        where: { status: 'active' }
      })
    ]);

    const analytics = {
      totalMessages: messageCount,
      totalUsers: userCount,
      activeChats: activeChats,
      timestamp: new Date()
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Get user engagement metrics
router.get('/engagement', auth, async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '7d'; // Default to 7 days
    const date = new Date();

    switch(timeframe) {
      case '7d':
        date.setDate(date.getDate() - 7);
        break;
      case '30d':
        date.setDate(date.getDate() - 30);
        break;
      case '90d':
        date.setDate(date.getDate() - 90);
        break;
      default:
        date.setDate(date.getDate() - 7);
    }

    const engagementMetrics = await prisma.message.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: date
        }
      },
      _count: {
        _all: true
      }
    });

    res.json({
      timeframe,
      metrics: engagementMetrics,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching engagement metrics:', error);
    res.status(500).json({ error: 'Failed to fetch engagement metrics' });
  }
});

// Get response time analytics
router.get('/performance', auth, async (req, res) => {
  try {
    const performance = await prisma.chat.aggregate({
      _avg: {
        responseTime: true
      },
      _min: {
        responseTime: true
      },
      _max: {
        responseTime: true
      }
    });

    res.json({
      performance,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    res.status(500).json({ error: 'Failed to fetch performance metrics' });
  }
});

module.exports = router;