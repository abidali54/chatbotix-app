import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';

const AboutUs = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        About Us
      </Typography>
      
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          Empowering Conversations Through AI
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to Trae AI, where we're revolutionizing the way businesses interact with their customers. Our cutting-edge chatbot solutions combine artificial intelligence with human-like conversation capabilities to deliver exceptional customer experiences.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body2">
              To provide businesses with intelligent, scalable, and personalized chatbot solutions that enhance customer engagement and streamline operations.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Our Vision
            </Typography>
            <Typography variant="body2">
              To lead the evolution of AI-powered communication, making meaningful conversations accessible to businesses of all sizes.
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Our Values
            </Typography>
            <Typography variant="body2">
              Innovation, reliability, customer focus, and continuous improvement drive everything we do at Trae AI.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Why Choose Trae AI?
        </Typography>
        <Typography variant="body1" paragraph>
          Our platform combines state-of-the-art natural language processing with intuitive design, making it easy for businesses to deploy powerful chatbot solutions. With features like real-time analytics, seamless integration, and customizable workflows, we help you deliver exceptional customer service 24/7.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutUs;