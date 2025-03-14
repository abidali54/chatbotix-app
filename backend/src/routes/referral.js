const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate referral link
router.post('/generate-link', async (req, res) => {
  try {
    const { userId } = req.body;
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const referral = await prisma.referral.create({
      data: {
        code: referralCode,
        userId,
        status: 'ACTIVE'
      }
    });

    const referralLink = `${process.env.FRONTEND_URL}/refer/${referralCode}`;
    res.json({ link: referralLink });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate referral link' });
  }
});

// Track referral stats
router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.query;

    const referralStats = await prisma.referral.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            conversions: true
          }
        }
      }
    });

    const totalReferrals = referralStats.length;
    const successfulConversions = referralStats.reduce((acc, curr) => acc + curr._count.conversions, 0);
    const rewardsEarned = successfulConversions * process.env.REFERRAL_REWARD_AMOUNT;

    res.json({
      totalReferrals,
      successfulConversions,
      rewardsEarned
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch referral stats' });
  }
});

// Process referral
router.post('/process', async (req, res) => {
  try {
    const { referralCode, newUserId } = req.body;

    const referral = await prisma.referral.findUnique({
      where: { code: referralCode }
    });

    if (!referral) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    // Create referral conversion
    const conversion = await prisma.referralConversion.create({
      data: {
        referralId: referral.id,
        newUserId,
        status: 'COMPLETED'
      }
    });

    // Process rewards for the referrer
    await prisma.userReward.create({
      data: {
        userId: referral.userId,
        amount: process.env.REFERRAL_REWARD_AMOUNT,
        type: 'REFERRAL',
        status: 'PENDING'
      }
    });

    res.json(conversion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process referral' });
  }
});

module.exports = router;