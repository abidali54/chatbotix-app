const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

const prisma = new PrismaClient();

// Get subscription status
router.get('/subscription', auth, async (req, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      return res.json(null);
    }

    res.json({
      plan: subscription.planId,
      status: subscription.status,
      nextBillingDate: subscription.currentPeriodEnd
    });
  } catch (err) {
    console.error('Error fetching subscription:', err);
    res.status(500).json({ message: 'Failed to fetch subscription data' });
  }
});

// Create payment intent
router.post('/create-payment', auth, async (req, res) => {
  try {
    const { paymentMethodId, amount, email } = req.body;

    // Create or get customer
    let customer = await prisma.customer.findUnique({
      where: { userId: req.user.id }
    });

    if (!customer) {
      const stripeCustomer = await stripe.customers.create({
        email,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId }
      });

      customer = await prisma.customer.create({
        data: {
          userId: req.user.id,
          stripeCustomerId: stripeCustomer.id,
          email
        }
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customer.stripeCustomerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status
    });
  } catch (err) {
    console.error('Payment creation failed:', err);
    res.status(400).json({ message: err.message });
  }
});

// Cancel subscription
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      return res.status(404).json({ message: 'No active subscription found' });
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    await prisma.subscription.update({
      where: { userId: req.user.id },
      data: { cancelAtPeriodEnd: true }
    });

    res.json({ message: 'Subscription will be canceled at the end of the billing period' });
  } catch (err) {
    console.error('Error canceling subscription:', err);
    res.status(500).json({ message: 'Failed to cancel subscription' });
  }
});

// Update order status
router.patch('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus,
        paymentStatus
      }
    });

    // Update Google Sheets
    await updateOrderSpreadsheet(order);

    res.json({
      status: 'success',
      data: order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update order'
    });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch orders'
    });
  }
});

module.exports = router;