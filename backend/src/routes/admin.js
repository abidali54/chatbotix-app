const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Middleware to ensure user is authenticated and has admin privileges
router.use(authMiddleware, adminMiddleware);

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        subscription: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        subscription: true
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user status
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Get all subscriptions
router.get('/subscriptions', async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: true
      }
    });
    res.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Update subscription status
router.patch('/subscriptions/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const subscription = await prisma.subscription.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(subscription);
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Get admin dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, activeSubscriptions, revenue] = await Promise.all([
      prisma.user.count(),
      prisma.subscription.count({
        where: { status: 'ACTIVE' }
      }),
      prisma.subscription.aggregate({
        where: { status: 'ACTIVE' },
        _sum: {
          amount: true
        }
      })
    ]);

    res.json({
      totalUsers,
      activeSubscriptions,
      totalRevenue: revenue._sum.amount || 0
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
});

module.exports = router;