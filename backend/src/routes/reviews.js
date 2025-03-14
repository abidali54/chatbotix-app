const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// Get product reviews
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId: req.params.productId,
        status: 'APPROVED'
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// Create review
router.post('/', auth, async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;

    // Verify that the user has purchased the product
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: req.user.id,
        orderItems: {
          some: {
            productId: productId
          }
        }
      }
    });

    if (!order) {
      return res.status(400).json({ message: 'You must purchase the product before reviewing it' });
    }

    // Check if user has already reviewed this product for this order
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: req.user.id,
        productId,
        orderId
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product for this order' });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId: req.user.id,
        productId,
        orderId
      }
    });

    // Update product rating statistics
    const productReviews = await prisma.review.findMany({
      where: {
        productId,
        status: 'APPROVED'
      },
      select: {
        rating: true
      }
    });

    const totalReviews = productReviews.length;
    const averageRating = totalReviews > 0
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating,
        totalReviews
      }
    });

    // Add loyalty points for reviewing
    await prisma.loyaltyPoints.upsert({
      where: {
        userId: req.user.id
      },
      create: {
        userId: req.user.id,
        points: 10,
        transactions: {
          create: {
            points: 10,
            type: 'EARNED',
            description: 'Points earned for product review'
          }
        }
      },
      update: {
        points: {
          increment: 10
        },
        transactions: {
          create: {
            points: 10,
            type: 'EARNED',
            description: 'Points earned for product review'
          }
        }
      }
    });

    res.json(review);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ message: 'Failed to create review' });
  }
});

// Admin: Update review status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { status } = req.body;
    const review = await prisma.review.update({
      where: { id: req.params.id },
      data: { status }
    });

    res.json(review);
  } catch (err) {
    console.error('Error updating review status:', err);
    res.status(500).json({ message: 'Failed to update review status' });
  }
});

module.exports = router;