const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const adminAuth = require('../../middleware/adminAuth');

router.use(adminAuth);

// Get all subscriptions
router.get('/subscriptions', async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: true,
        plan: true
      }
    });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update subscription status
router.patch('/subscriptions/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const subscription = await prisma.subscription.update({
      where: { id },
      data: { status }
    });

    await prisma.subscriptionHistory.create({
      data: {
        subscriptionId: id,
        action: `status_changed_to_${status}`,
        adminId: req.user.id,
        details: { previousStatus: subscription.status }
      }
    });

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new subscription plan
router.post('/plans', async (req, res) => {
  const { name, price, duration, features } = req.body;

  try {
    const plan = await prisma.subscriptionPlan.create({
      data: {
        name,
        price,
        duration,
        features
      }
    });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
