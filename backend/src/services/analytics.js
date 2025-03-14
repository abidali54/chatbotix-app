const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AnalyticsService {
  static async trackVisit(sessionId, userId, path, ipAddress, userAgent) {
    try {
      const visit = await prisma.visit.create({
        data: {
          sessionId,
          userId,
          path,
          ipAddress,
          userAgent,
          duration: 0
        }
      });
      return visit;
    } catch (error) {
      console.error('Error tracking visit:', error);
      throw error;
    }
  }

  static async trackProductView(sessionId, productId) {
    try {
      const [productVisit, updatedProduct] = await prisma.$transaction([
        prisma.productVisit.create({
          data: {
            sessionId,
            productId
          }
        }),
        prisma.product.update({
          where: { id: productId },
          data: {
            viewCount: { increment: 1 }
          }
        })
      ]);
      return { productVisit, updatedProduct };
    } catch (error) {
      console.error('Error tracking product view:', error);
      throw error;
    }
  }

  static async getConversionFunnelData(timeframe = '7d') {
    try {
      const date = new Date();
      date.setDate(date.getDate() - parseInt(timeframe));

      const [visits, productViews, cartItems, orders] = await Promise.all([
        prisma.visit.count({
          where: { createdAt: { gte: date } }
        }),
        prisma.productVisit.count({
          where: { createdAt: { gte: date } }
        }),
        prisma.cartItem.count({
          where: { createdAt: { gte: date } }
        }),
        prisma.order.count({
          where: { createdAt: { gte: date } }
        })
      ]);

      return {
        visits,
        productViews,
        cartItems,
        orders,
        conversionRate: orders > 0 ? (orders / visits * 100).toFixed(2) : 0
      };
    } catch (error) {
      console.error('Error getting conversion funnel data:', error);
      throw error;
    }
  }

  static async getCustomerJourneyMap(userId) {
    try {
      const userActivity = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          visits: {
            orderBy: { createdAt: 'asc' }
          },
          cart: {
            include: { product: true }
          },
          orders: {
            include: {
              orderItems: {
                include: { product: true }
              }
            }
          }
        }
      });

      return userActivity;
    } catch (error) {
      console.error('Error getting customer journey map:', error);
      throw error;
    }
  }

  static async trackAbandonedCart(userId, items) {
    try {
      const abandonedCart = await prisma.abandonedCart.create({
        data: {
          userId,
          items
        }
      });
      return abandonedCart;
    } catch (error) {
      console.error('Error tracking abandoned cart:', error);
      throw error;
    }
  }
}

module.exports = AnalyticsService;