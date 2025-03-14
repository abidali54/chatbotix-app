import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField
} from '@mui/material';

const PaymentIntegration = () => {
  const [transactions, setTransactions] = useState([]);
  const [configDialog, setConfigDialog] = useState(false);
  const [config, setConfig] = useState({
    stripeKey: '',
    webhookSecret: '',
    currency: 'USD'
  });

  useEffect(() => {
    fetchTransactions();
    fetchConfig();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/admin/payments/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleRefund = async (transactionId) => {
    try {
      await fetch(`/api/admin/payments/refund/${transactionId}`, {
        method: 'POST'
      });
      fetchTransactions();
    } catch (error) {
      console.error('Error processing refund:', error);
    }
  };

  const saveConfig = async () => {
    try {
      await fetch('/api/admin/payments/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      setConfigDialog(false);
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6">
          Payment Management
          <Button
            onClick={() => setConfigDialog(true)}
            variant="outlined"
            sx={{ float: 'right' }}
          >
            Configure
          </Button>
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.id}</TableCell>
                <TableCell>{transaction.user.email}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell>{transaction.status}</TableCell>
                <TableCell>
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {transaction.status === 'succeeded' && (
                    <Button
                      size="small"
                      onClick={() => handleRefund(transaction.id)}
                    >
                      Refund
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={configDialog} onClose={() => setConfigDialog(false)}>
          <DialogTitle>Payment Configuration</DialogTitle>
          <DialogContent>
            <TextField
              label="Stripe Secret Key"
              value={config.stripeKey}
              onChange={(e) => setConfig({ ...config, stripeKey: e.target.value })}
              fullWidth
              margin="normal"
              type="password"
            />
            <TextField
              label="Webhook Secret"
              value={config.webhookSecret}
              onChange={(e) => setConfig({ ...config, webhookSecret: e.target.value })}
              fullWidth
              margin="normal"
              type="password"
            />
            <Button onClick={saveConfig} variant="contained" sx={{ mt: 2 }}>
              Save Configuration
            </Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PaymentIntegration;