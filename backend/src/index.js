require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const winston = require('winston');
const expressWinston = require('express-winston');
const { PrismaClient } = require('@prisma/client');
const WebSocketServer = require('./websocket');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');

const app = express();
const prisma = new PrismaClient();

// Initialize i18next
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json'
    },
    fallbackLng: 'en',
    preload: ['en', 'es', 'fr'],
    ns: ['common'],
    defaultNS: 'common'
  });

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Winston logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(i18nextMiddleware.handle(i18next));

// Request logging middleware
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/livechat', require('./routes/livechat'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/ecommerce', require('./routes/ecommerce')); // Add e-commerce routes
app.use('/api/ecommerce-analytics', require('./routes/ecommerce-analytics')); // Add e-commerce analytics routes
app.use('/api/reviews', require('./routes/reviews')); // Add product reviews routes
app.use('/api/loyalty', require('./routes/loyalty')); // Add loyalty program routes
app.use('/api/admin', require('./routes/admin')); // Add admin routes
app.use('/api/email-marketing', require('./routes/email-marketing')); // Add email marketing routes
app.use('/api/referral', require('./routes/referral')); // Add referral program routes

// Error logging middleware
app.use(expressWinston.errorLogger({
  winstonInstance: logger
}));

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', { error: err.message, stack: err.stack });
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong!';
  
  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});