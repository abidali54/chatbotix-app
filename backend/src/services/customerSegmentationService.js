const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class CustomerSegmentationService {
  async segmentCustomers() {
    try {
      const customers = await prisma.user.findMany({
        include: {
          orders: {
            include: {
              orderItems: true
            }
          },
          visits: true,
          abandonedCarts: true
        }
      });

      const segments = customers.map(customer => {
        const totalSpent = customer.orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );

        const orderCount = customer.orders.length;
        const averageOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;
        const lastOrderDate = customer.orders.length > 0
          ? Math.max(...customer.orders.map(order => new Date(order.createdAt).getTime()))
          : null;

        const visitCount = customer.visits.length;
        const abandonedCartCount = customer.abandonedCarts.length;

        // Calculate RFM scores
        const recency = lastOrderDate
          ? Math.floor((Date.now() - lastOrderDate) / (1000 * 60 * 60 * 24))
          : Number.MAX_SAFE_INTEGER;
        const frequency = orderCount;
        const monetary = totalSpent;

        // Determine customer segment
        let segment = 'New';
        if (orderCount > 0) {
          if (recency <= 30 && frequency >= 3 && monetary >= 500) {
            segment = 'VIP';
          } else if (recency <= 60 && frequency >= 2 && monetary >= 200) {
            segment = 'Loyal';
          } else if (recency <= 90 && frequency >= 1) {
            segment = 'Regular';
          } else {
            segment = 'At Risk';
          }
        }

        return {
          userId: customer.id,
          segment,
          metrics: {
            totalSpent,
            orderCount,
            averageOrderValue,
            lastOrderDate: lastOrderDate ? new Date(lastOrderDate) : null,
            visitCount,
            abandonedCartCount,
            recency,
            frequency,
            monetary
          }
        };
      });

      // Update user segments in database
      for (const segmentData of segments) {
        await prisma.customerSegment.upsert({
          where: { userId: segmentData.userId },
          update: {
            segment: segmentData.segment,
            metrics: segmentData.metrics,
            updatedAt: new Date()
          },
          create: {
            userId: segmentData.userId,
            segment: segmentData.segment,
            metrics: segmentData.metrics
          }
        });
      }

      return segments;
    } catch (error) {
      console.error('Error segmenting customers:', error);
      throw error;
    }
  }

  async getCustomerSegment(userId) {
    try {
      const segment = await prisma.customerSegment.findUnique({
        where: { userId }
      });
      return segment;
    } catch (error) {
      console.error('Error fetching customer segment:', error);
      throw error;
    }
  }

  async getSegmentStats() {
    try {
      const stats = await prisma.customerSegment.groupBy({
        by: ['segment'],
        _count: {
          _all: true
        }
      });

      return stats;
    } catch (error) {
      console.error('Error fetching segment stats:', error);
      throw error;
    }
  }
}

module.exports = new CustomerSegmentationService();