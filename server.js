const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const config = require('./config/env');
const deploy = require('./config/deploy');

const app = express();

// Security middleware
app.use(helmet(deploy.security.headers));
app.use(compression());

// Rate limiting
if (deploy.security.rateLimit.enabled) {
  app.use(rateLimit(deploy.security.rateLimit));
}

// Logging
if (deploy.monitoring.enabled) {
  app.use(morgan('combined', {
    skip: (req, res) => res.statusCode < 400,
    stream: require('rotating-file-stream').createStream('error.log', {
      path: deploy.monitoring.logs.path,
      size: '10M',
      interval: '1d'
    })
  }));
}

// Static files
app.use(express.static(path.join(__dirname, 'build')));

// API routes
app.use('/api', require('./routes'));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});