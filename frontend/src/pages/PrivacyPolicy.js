import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Privacy Policy
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            At Chatbotix, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our chatbot services and visit our website.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We collect information that you provide directly to us, including:
          </Typography>
          <ul>
            <Typography component="li" variant="body1">Account information (name, email, company details)</Typography>
            <Typography component="li" variant="body1">Chat logs and conversation history</Typography>
            <Typography component="li" variant="body1">Usage data and analytics</Typography>
            <Typography component="li" variant="body1">Payment information</Typography>
          </ul>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the collected information for:
          </Typography>
          <ul>
            <Typography component="li" variant="body1">Providing and improving our services</Typography>
            <Typography component="li" variant="body1">Personalizing user experience</Typography>
            <Typography component="li" variant="body1">Processing payments</Typography>
            <Typography component="li" variant="body1">Communicating with you about updates and support</Typography>
          </ul>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Your Rights
          </Typography>
          <Typography variant="body1" paragraph>
            You have the right to:
          </Typography>
          <ul>
            <Typography component="li" variant="body1">Access your personal data</Typography>
            <Typography component="li" variant="body1">Correct inaccurate data</Typography>
            <Typography component="li" variant="body1">Request deletion of your data</Typography>
            <Typography component="li" variant="body1">Object to data processing</Typography>
          </ul>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Updates to This Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy, please contact us at privacy@traeai.com.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PrivacyPolicy;