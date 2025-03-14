const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// Get sales analytics
router.get('/sales', auth, async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '7d';
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

    const salesMetrics = await prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: date
        }
      },
      _count: {
        _all: true
      },
      _sum: {
        totalAmount: true
      }
    });

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: {
            gte: date
          }
        }
      },
      _sum: {
        quantity: true,
        price: true
      }
    });

    res.json({
      timeframe,
      salesMetrics,
      topProducts,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching sales analytics:', error);
    res.status(500).json({ error: 'Failed to fetch sales analytics' });
  }
});

// Get inventory analytics
router.get('/inventory', auth, async (req, res) => {
  try {
    const inventoryMetrics = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        inventory: true,
        price: true,
        category: true,
        _count: {
          select: {
            orderItems: true
          }
        }
      }
    });

    const lowStockProducts = inventoryMetrics.filter(product => product.inventory < 10);

    res.json({
      inventoryMetrics,
      lowStockProducts,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching inventory analytics:', error);
    res.status(500).json({ error: 'Failed to fetch inventory analytics' });
  }
});

// Get customer behavior analytics
router.get('/customer-behavior', auth, async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '30d';
    const date = new Date();
    date.setDate(date.getDate() - (timeframe === '30d' ? 30 : 90));

    const customerMetrics = await prisma.user.findMany({
      where: {
        orders: {
          some: {
            createdAt: {
              gte: date
            }
          }
        }
      },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            orders: true
          }
        },
        orders: {
          where: {
            createdAt: {
              gte: date
            }
          },
          select: {
            totalAmount: true
          }
        }
      }
    });

    const customerSegments = customerMetrics.map(customer => ({
      ...customer,
      totalSpent: customer.orders.reduce((sum, order) => sum + order.totalAmount, 0),
      averageOrderValue: customer.orders.reduce((sum, order) => sum + order.totalAmount, 0) / customer.orders.length
    }));

    res.json({
      timeframe,
      customerSegments,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching customer behavior analytics:', error);
    res.status(500).json({ error: 'Failed to fetch customer behavior analytics' });
  }
});

module.exports = router;