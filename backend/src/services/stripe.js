const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeService {
  async createPaymentIntent(amount, currency = 'usd') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
      });
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async createCustomer(email, name) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
      });
      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async attachPaymentMethod(customerId, paymentMethodId) {
    try {
      const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      return paymentMethod;
    } catch (error) {
      console.error('Error attaching payment method:', error);
      throw error;
    }
  }

  async createSubscription(customerId, priceId) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async handleWebhookEvent(event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          return this.handlePaymentIntentSucceeded(event.data.object);
        case 'payment_intent.failed':
          return this.handlePaymentIntentFailed(event.data.object);
        case 'customer.subscription.created':
          return this.handleSubscriptionCreated(event.data.object);
        case 'customer.subscription.updated':
          return this.handleSubscriptionUpdated(event.data.object);
        case 'customer.subscription.deleted':
          return this.handleSubscriptionDeleted(event.data.object);
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      throw error;
    }
  }

  // Webhook event handlers
  async handlePaymentIntentSucceeded(paymentIntent) {
    // Implement payment success logic
  }

  async handlePaymentIntentFailed(paymentIntent) {
    // Implement payment failure logic
  }

  async handleSubscriptionCreated(subscription) {
    // Implement subscription creation logic
  }

  async handleSubscriptionUpdated(subscription) {
    // Implement subscription update logic
  }

  async handleSubscriptionDeleted(subscription) {
    // Implement subscription deletion logic
  }
}

module.exports = new StripeService();