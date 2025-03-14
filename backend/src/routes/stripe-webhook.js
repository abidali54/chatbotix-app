const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Stripe webhook handler
router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        await handleSubscriptionUpdate(subscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        await handleSubscriptionCancellation(deletedSubscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handlePaymentSuccess(paymentIntent) {
  const customerId = paymentIntent.customer;
  const amount = paymentIntent.amount;

  await prisma.payment.create({
    data: {
      stripePaymentId: paymentIntent.id,
      amount,
      status: 'succeeded',
      customerId
    }
  });
}

async function handleSubscriptionUpdate(subscription) {
  const customerId = subscription.customer;
  const status = subscription.status;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

  await prisma.subscription.upsert({
    where: { stripeCustomerId: customerId },
    update: {
      status,
      currentPeriodEnd,
      planId: subscription.plan.id,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    },
    create: {
      stripeCustomerId: customerId,
      status,
      currentPeriodEnd,
      planId: subscription.plan.id,
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    }
  });
}

async function handleSubscriptionCancellation(subscription) {
  const customerId = subscription.customer;

  await prisma.subscription.update({
    where: { stripeCustomerId: customerId },
    data: {
      status: 'canceled',
      canceledAt: new Date()
    }
  });
}

module.exports = router;