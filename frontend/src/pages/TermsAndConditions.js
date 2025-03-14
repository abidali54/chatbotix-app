import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const TermsAndConditions = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Terms and Conditions
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Acceptance of Terms
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing and using Chatbotix  services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with these terms, please do not use our services.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Service Description
          </Typography>
          <Typography variant="body1" paragraph>
            Chatbotix provides AI-powered chatbot solutions for businesses. Our services include but are not limited to chatbot deployment, customization, analytics, and support. We reserve the right to modify, suspend, or discontinue any part of our services at any time.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            User Obligations
          </Typography>
          <Typography variant="body1" paragraph>
            As a user of our services, you agree to:
          </Typography>
          <ul>
            <Typography component="li" variant="body1">Provide accurate and complete information</Typography>
            <Typography component="li" variant="body1">Maintain the security of your account credentials</Typography>
            <Typography component="li" variant="body1">Use our services in compliance with applicable laws</Typography>
            <Typography component="li" variant="body1">Not engage in any unauthorized or harmful activities</Typography>
          </ul>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph>
            All content, features, and functionality of our services are owned by Trae AI and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our explicit permission.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Payment Terms
          </Typography>
          <Typography variant="body1" paragraph>
            Subscription fees are billed in advance on a monthly or annual basis. All payments are non-refundable unless otherwise required by law. We reserve the right to modify our pricing with reasonable notice.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Limitation of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            Chatbotix shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services. Our liability is limited to the amount paid by you for the services in the previous 12 months.
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Termination
          </Typography>
          <Typography variant="body1" paragraph>
            We may terminate or suspend your access to our services immediately, without prior notice, for any breach of these Terms and Conditions. Upon termination, your right to use our services will immediately cease.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>
            Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these Terms and Conditions at any time. We will notify users of any material changes via email or through our website. Your continued use of our services following such modifications constitutes your acceptance of the updated terms.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsAndConditions;