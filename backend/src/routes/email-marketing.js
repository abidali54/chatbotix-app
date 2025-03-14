const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Route to handle email campaign creation
router.post('/campaigns', async (req, res) => {
  try {
    const { name, subject, content, targetAudience } = req.body;
    const campaign = await prisma.emailCampaign.create({
      data: {
        name,
        subject,
        content,
        targetAudience,
        status: 'DRAFT'
      }
    });
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

// Route to handle abandoned cart emails
router.post('/abandoned-cart', async (req, res) => {
  try {
    const { userId, cartId } = req.body;
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: true, user: true }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Create abandoned cart recovery email
    const emailTask = await prisma.emailTask.create({
      data: {
        type: 'ABANDONED_CART',
        userId,
        cartId,
        status: 'PENDING',
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000) // Schedule for 24 hours later
      }
    });

    res.json(emailTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create abandoned cart email' });
  }
});

// Route to get email campaign analytics
router.get('/analytics', async (req, res) => {
  try {
    const analytics = await prisma.emailCampaign.findMany({
      select: {
        id: true,
        name: true,
        sentCount: true,
        openCount: true,
        clickCount: true,
        createdAt: true
      }
    });
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;