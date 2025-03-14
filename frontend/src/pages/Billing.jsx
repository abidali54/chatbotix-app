import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Grid, CircularProgress } from '@mui/material';
import { Elements } from '@stripe/stripe-react-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from '../components/PaymentForm';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Billing = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/billing/subscription');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch subscription data');
      }

      setSubscriptionData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (result) => {
    // Refresh subscription data after successful payment
    await fetchSubscriptionData();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Billing & Subscription
      </Typography>

      {error && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: 'error.light', color: 'error.contrastText' }}>
          {error}
        </Paper>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Current Subscription
            </Typography>
            {subscriptionData ? (
              <Box>
                <Typography>Plan: {subscriptionData.plan}</Typography>
                <Typography>Status: {subscriptionData.status}</Typography>
                <Typography>
                  Next billing date: {new Date(subscriptionData.nextBillingDate).toLocaleDateString()}
                </Typography>
              </Box>
            ) : (
              <Typography>No active subscription</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
            <Elements stripe={stripePromise}>
              <PaymentForm
                amount={2999} // $29.99
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Billing;