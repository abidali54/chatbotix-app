import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';

const NotificationSystem = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    type: 'all',
    priority: 'normal'
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSend = async () => {
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification)
      });

      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: 'Notification sent successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to send notification',
        severity: 'error'
      });
    }
  };

  return (
    <>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6">
            Notifications
            <Button
              variant="contained"
              onClick={() => setOpenDialog(true)}
              sx={{ float: 'right' }}
            >
              Send Notification
            </Button>
          </Typography>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={notification.title}
            onChange={(e) => setNotification({ ...notification, title: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Message"
            value={notification.message}
            onChange={(e) => setNotification({ ...notification, message: e.target.value })}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Recipients</InputLabel>
            <Select
              value={notification.type}
              onChange={(e) => setNotification({ ...notification, type: e.target.value })}
            >
              <MenuItem value="all">All Users</MenuItem>
              <MenuItem value="active">Active Subscribers</MenuItem>
              <MenuItem value="expired">Expired Subscribers</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSend} variant="contained">
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NotificationSystem;