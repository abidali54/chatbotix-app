import React from 'react';
import { Container, Typography, Grid, Paper, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        About Trae AI
      </Typography>
      
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          The Future of Customer Engagement
        </Typography>
        <Typography variant="body1" paragraph>
          Trae AI is at the forefront of revolutionizing customer support through advanced artificial intelligence. 
          Our platform combines cutting-edge technology with intuitive design to create seamless, 
          intelligent interactions between businesses and their customers.
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Our Technology
            </Typography>
            <Typography variant="body2" paragraph>
              Built on state-of-the-art machine learning models and natural language processing, 
              our AI chatbot understands context, learns from interactions, and provides accurate, 
              helpful responses in real-time.
            </Typography>
            <Button component={Link} to="/documentation" variant="outlined" color="primary">
              Learn More
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Our Impact
            </Typography>
            <Typography variant="body2" paragraph>
              We've helped businesses across various industries improve their customer service efficiency, 
              reduce response times, and increase customer satisfaction while significantly lowering operational costs.
            </Typography>
            <Button component={Link} to="/case-studies" variant="outlined" color="primary">
              View Case Studies
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Ready to Transform Your Customer Support?
        </Typography>
        <Button component={Link} to="/register" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
          Get Started Today
        </Button>
      </Box>
    </Container>
  );
};

export default About;