import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, Typography } from '@mui/material';
import SubscriptionList from './SubscriptionList';
import PlanManager from './PlanManager';
import Analytics from './Analytics';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    activeSubscriptions: 0,
    totalRevenue: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Active Subscriptions</Typography>
            <Typography variant="h3">{stats.activeSubscriptions}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h3">${stats.totalRevenue}</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Pending Approvals</Typography>
            <Typography variant="h3">{stats.pendingApprovals}</Typography>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <SubscriptionList />
        </Grid>
        <Grid item xs={12} md={4}>
          <PlanManager />
        </Grid>
      </Grid>

      <Analytics />
    </Container>
  );
};

export default AdminDashboard;