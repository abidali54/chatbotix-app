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
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { Info, Warning } from '@mui/icons-material';

const UserActivity = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/admin/user-activity');
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const getActivityColor = (type) => {
    const colors = {
      login: 'primary',
      payment: 'success',
      subscription: 'info',
      error: 'error'
    };
    return colors[type] || 'default';
  };

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          User Activity Log
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Activity</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.user.email}</TableCell>
                <TableCell>{activity.description}</TableCell>
                <TableCell>
                  <Chip
                    label={activity.type}
                    color={getActivityColor(activity.type)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(activity.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  {activity.type === 'error' ? (
                    <Tooltip title={activity.details}>
                      <IconButton size="small" color="error">
                        <Warning />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title={activity.details}>
                      <IconButton size="small">
                        <Info />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserActivity;