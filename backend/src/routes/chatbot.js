const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { authenticateToken } = require('../middleware/auth');

const prisma = new PrismaClient();

// Validation schemas
const chatbotSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  platform: z.enum(['WHATSAPP', 'FACEBOOK', 'MESSENGER', 'INSTAGRAM', 'WEBSITE'])
});

// Create chatbot
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, platform } = chatbotSchema.parse(req.body);

    const chatbot = await prisma.chatbot.create({
      data: {
        name,
        description,
        platform,
        userId: req.user.id
      }
    });

    res.status(201).json({
      message: 'Chatbot created successfully',
      chatbot
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get all chatbots for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const chatbots = await prisma.chatbot.findMany({
      where: {
        userId: req.user.id,
        status: 'ACTIVE'
      },
      include: {
        flows: true
      }
    });

    res.json(chatbots);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get single chatbot
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        flows: true
      }
    });

    if (!chatbot) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }

    res.json(chatbot);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Update chatbot
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, platform } = chatbotSchema.parse(req.body);

    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!chatbot) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }

    const updatedChatbot = await prisma.chatbot.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        platform
      }
    });

    res.json({
      message: 'Chatbot updated successfully',
      chatbot: updatedChatbot
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors });
    }
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Delete chatbot (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!chatbot) {
      return res.status(404).json({ message: 'Chatbot not found' });
    }

    await prisma.chatbot.update({
      where: { id: req.params.id },
      data: { status: 'DELETED' }
    });

    res.json({ message: 'Chatbot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;