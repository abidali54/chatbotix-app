import React from 'react';
import { Container, Typography, Grid, Paper, Box, List, ListItem, ListItemText, Divider } from '@mui/material';

const Documentation = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Documentation
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Navigation
            </Typography>
            <List>
              <ListItem button>
                <ListItemText primary="Getting Started" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="API Reference" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Integration Guide" />
              </ListItem>
              <ListItem button>
                <ListItemText primary="Best Practices" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Getting Started
              </Typography>
              <Typography variant="body1" paragraph>
                Welcome to Trae AI documentation. This guide will help you integrate and maximize the potential of our AI-powered chatbot platform.
              </Typography>
              <Divider sx={{ my: 2 }} />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                1. Platform Overview
              </Typography>
              <Typography variant="body1" paragraph>
                Trae AI offers a comprehensive suite of features including:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="AI Chatbot"
                    secondary="Intelligent conversation handling with natural language processing"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Live Chat Integration"
                    secondary="Seamless handoff between AI and human agents"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Analytics Dashboard"
                    secondary="Real-time insights and performance metrics"
                  />
                </ListItem>
              </List>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                2. Integration Steps
              </Typography>
              <Typography variant="body1" paragraph>
                Follow these steps to integrate Trae AI into your platform:
              </Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Step 1: API Key Setup"
                    secondary="Generate your API key from the dashboard"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Step 2: Widget Installation"
                    secondary="Add our widget script to your website"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Step 3: Configuration"
                    secondary="Customize the chatbot behavior and appearance"
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Documentation;