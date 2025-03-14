const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// Get user's loyalty points
router.get('/points', auth, async (req, res) => {
  try {
    const loyaltyPoints = await prisma.loyaltyPoints.findUnique({
      where: { userId: req.user.id },
      include: {
        transactions: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!loyaltyPoints) {
      return res.json({
        points: 0,
        transactions: []
      });
    }

    res.json(loyaltyPoints);
  } catch (err) {
    console.error('Error fetching loyalty points:', err);
    res.status(500).json({ message: 'Failed to fetch loyalty points' });
  }
});

// Add points for purchase
router.post('/points/purchase', auth, async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const pointsEarned = Math.floor(amount); // 1 point per currency unit

    const loyaltyPoints = await prisma.loyaltyPoints.upsert({
      where: {
        userId: req.user.id
      },
      create: {
        userId: req.user.id,
        points: pointsEarned,
        transactions: {
          create: {
            points: pointsEarned,
            type: 'EARNED',
            description: `Points earned for order ${orderId}`
          }
        }
      },
      update: {
        points: {
          increment: pointsEarned
        },
        transactions: {
          create: {
            points: pointsEarned,
            type: 'EARNED',
            description: `Points earned for order ${orderId}`
          }
        }
      },
      include: {
        transactions: true
      }
    });

    res.json(loyaltyPoints);
  } catch (err) {
    console.error('Error adding loyalty points:', err);
    res.status(500).json({ message: 'Failed to add loyalty points' });
  }
});

// Redeem points for discount
router.post('/points/redeem', auth, async (req, res) => {
  try {
    const { points } = req.body;
    const minimumPoints = 100; // Minimum points required for redemption
    
    const loyaltyPoints = await prisma.loyaltyPoints.findUnique({
      where: { userId: req.user.id }
    });

    if (!loyaltyPoints || loyaltyPoints.points < points) {
      return res.status(400).json({ message: 'Insufficient points' });
    }

    if (points < minimumPoints) {
      return res.status(400).json({ 
        message: `Minimum ${minimumPoints} points required for redemption`
      });
    }

    const discountAmount = points / 100; // Convert points to currency value

    const updatedPoints = await prisma.loyaltyPoints.update({
      where: { userId: req.user.id },
      data: {
        points: {
          decrement: points
        },
        transactions: {
          create: {
            points: -points,
            type: 'REDEEMED',
            description: `Points redeemed for $${discountAmount} discount`
          }
        }
      },
      include: {
        transactions: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    res.json({
      points: updatedPoints.points,
      discountAmount,
      transactions: updatedPoints.transactions
    });
  } catch (err) {
    console.error('Error redeeming points:', err);
    res.status(500).json({ message: 'Failed to redeem points' });
  }
});

module.exports = router;