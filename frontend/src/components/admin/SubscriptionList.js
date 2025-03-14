import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Switch,
  TablePagination
} from '@mui/material';

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/admin/subscriptions');
      const data = await response.json();
      setSubscriptions(data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await fetch(`/api/admin/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchSubscriptions();
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Plan</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Expiry Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subscriptions
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.user.email}</TableCell>
                <TableCell>{subscription.plan.name}</TableCell>
                <TableCell>
                  <Switch
                    checked={subscription.status === 'active'}
                    onChange={() => handleStatusChange(subscription.id, subscription.status)}
                  />
                </TableCell>
                <TableCell>
                  {new Date(subscription.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button size="small" variant="outlined">
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={subscriptions.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />
    </Paper>
  );
};

export default SubscriptionList;