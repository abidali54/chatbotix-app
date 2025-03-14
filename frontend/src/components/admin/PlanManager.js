import React, { useState, useEffect } from 'react';
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
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const PlanManager = () => {
  const [plans, setPlans] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPlan, setCurrentPlan] = useState({
    name: '',
    price: '',
    duration: '',
    features: []
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/admin/plans');
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const method = currentPlan.id ? 'PUT' : 'POST';
      const url = currentPlan.id 
        ? `/api/admin/plans/${currentPlan.id}`
        : '/api/admin/plans';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPlan)
      });

      setOpenDialog(false);
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Subscription Plans
          <Button
            startIcon={<Add />}
            onClick={() => {
              setCurrentPlan({ name: '', price: '', duration: '', features: [] });
              setOpenDialog(true);
            }}
            sx={{ float: 'right' }}
          >
            Add Plan
          </Button>
        </Typography>

        <List>
          {plans.map((plan) => (
            <ListItem
              key={plan.id}
              secondaryAction={
                <>
                  <IconButton onClick={() => {
                    setCurrentPlan(plan);
                    setOpenDialog(true);
                  }}>
                    <Edit />
                  </IconButton>
                  <IconButton>
                    <Delete />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={plan.name}
                secondary={`$${plan.price} / ${plan.duration} days`}
              />
            </ListItem>
          ))}
        </List>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>
            {currentPlan.id ? 'Edit Plan' : 'New Plan'}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Plan Name"
              value={currentPlan.name}
              onChange={(e) => setCurrentPlan({ ...currentPlan, name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price"
              type="number"
              value={currentPlan.price}
              onChange={(e) => setCurrentPlan({ ...currentPlan, price: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Duration (days)"
              type="number"
              value={currentPlan.duration}
              onChange={(e) => setCurrentPlan({ ...currentPlan, duration: e.target.value })}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PlanManager;