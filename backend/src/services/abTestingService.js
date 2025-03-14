const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class ABTestingService {
  constructor() {
    this.variants = ['A', 'B'];
  }

  async assignVariant(userId, testName) {
    try {
      // Check if user already has a variant assigned
      const existingAssignment = await prisma.abTest.findFirst({
        where: {
          userId,
          testName
        }
      });

      if (existingAssignment) {
        return existingAssignment.variant;
      }

      // Randomly assign a variant
      const variant = this.variants[Math.floor(Math.random() * this.variants.length)];

      // Record the assignment
      await prisma.abTest.create({
        data: {
          userId,
          testName,
          variant,
          assignedAt: new Date()
        }
      });

      return variant;
    } catch (error) {
      console.error('Error assigning A/B test variant:', error);
      throw error;
    }
  }

  async trackConversion(userId, testName, conversionType, value = 1) {
    try {
      const assignment = await prisma.abTest.findFirst({
        where: {
          userId,
          testName
        }
      });

      if (!assignment) {
        throw new Error('No A/B test assignment found for this user');
      }

      // Record the conversion
      await prisma.abTestConversion.create({
        data: {
          abTestId: assignment.id,
          conversionType,
          value,
          convertedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error tracking A/B test conversion:', error);
      throw error;
    }
  }

  async getTestResults(testName) {
    try {
      const results = await prisma.abTest.groupBy({
        by: ['variant'],
        where: {
          testName
        },
        _count: {
          _all: true
        }
      });

      const conversions = await prisma.abTestConversion.findMany({
        where: {
          abTest: {
            testName
          }
        },
        include: {
          abTest: true
        }
      });

      const variantStats = {};

      results.forEach(result => {
        variantStats[result.variant] = {
          participants: result._count._all,
          conversions: 0,
          conversionRate: 0,
          totalValue: 0
        };
      });

      conversions.forEach(conversion => {
        const variant = conversion.abTest.variant;
        variantStats[variant].conversions++;
        variantStats[variant].totalValue += conversion.value;
      });

      // Calculate conversion rates
      Object.keys(variantStats).forEach(variant => {
        const stats = variantStats[variant];
        stats.conversionRate = (stats.conversions / stats.participants) * 100;
      });

      return variantStats;
    } catch (error) {
      console.error('Error getting A/B test results:', error);
      throw error;
    }
  }
}

module.exports = new ABTestingService();