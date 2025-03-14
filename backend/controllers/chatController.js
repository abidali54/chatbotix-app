const { generateResponse, generateStreamResponse } = require('../services/geminiService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Send a message to the chatbot
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message processed successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
const handleChat = async (req, res) => {
  const { message } = req.body;
  const userId = req.user?.id;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    if (req.headers['accept'] === 'text/event-stream') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = generateStreamResponse(message);
      let fullResponse = '';
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }

      // Save to database after complete response
      if (userId) {
        await prisma.chat.create({
          data: {
            message,
            response: fullResponse,
            userId
          }
        });
      }
      
      res.end();
    } else {
      const response = await generateResponse(message);
      
      if (userId) {
        await prisma.chat.create({
          data: {
            message,
            response,
            userId
          }
        });
      }
      
      res.json({ response });
    }
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

/**
 * @swagger
 * /api/chat/history:
 *   get:
 *     summary: Get chat history
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat history retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const getChatHistory = async (req, res) => {
  try {
    const history = await prisma.chat.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(history);
  } catch (error) {
    console.error('History Error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};
/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Send a message to the chatbot
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message processed successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
const handleChat = async (req, res) => {
  const { message } = req.body;
  const userId = req.user?.id;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    if (req.headers['accept'] === 'text/event-stream') {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const stream = generateStreamResponse(message);
      let fullResponse = '';
      
      for await (const chunk of stream) {
        fullResponse += chunk;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }

      // Save to database after complete response
      if (userId) {
        await prisma.chat.create({
          data: {
            message,
            response: fullResponse,
            userId
          }
        });
      }
      
      res.end();
    } else {
      const response = await generateResponse(message);
      
      if (userId) {
        await prisma.chat.create({
          data: {
            message,
            response,
            userId
          }
        });
      }
      
      res.json({ response });
    }
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

/**
 * @swagger
 * /api/chat/history:
 *   get:
 *     summary: Get chat history
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Chat history retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
const getChatHistory = async (req, res) => {
  try {
    const history = await prisma.chat.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json(history);
  } catch (error) {
    console.error('History Error:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

module.exports = { handleChat, getChatHistory };