const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { PrismaClient } = require('@prisma/client');
const swaggerSpecs = require('./config/swagger');
const sessionConfig = require('./config/session');
const logger = require('./utils/logger');
const { handleChat, getChatHistory } = require('./controllers/chatController');
const authMiddleware = require('./middleware/auth');
const { validateChat } = require('./middleware/validator');
const adminRoutes = require('./routes/admin');
const healthRoutes = require('./routes/health');
const errorHandler = require('./middleware/errorHandler');
const sanitizeInput = require('./middleware/sanitizer');
const performanceMiddleware = require('./middleware/monitor');

require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'your-production-domain.com' 
    : 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Routes
app.post('/api/chat', validateChat, handleChat);
app.get('/api/chat/history', authMiddleware, getChatHistory);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
app.use(sessionConfig);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Routes
app.post('/api/chat', validateChat, handleChat);
app.get('/api/chat/history', authMiddleware, getChatHistory);

// Middleware
app.use(performanceMiddleware);
app.use(sanitizeInput);

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api', healthRoutes);

// Error handling should be last
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  logger.info('Server shutting down');
  process.exit(0);
});
