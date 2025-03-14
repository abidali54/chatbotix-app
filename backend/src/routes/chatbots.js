const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all chatbots
router.get('/', async (req, res) => {
  try {
    const chatbots = await prisma.chatbot.findMany();
    res.json(chatbots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chatbots' });
  }
});

// Create a new chatbot
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const chatbot = await prisma.chatbot.create({
      data: {
        name,
        description,
        status: 'active',
        conversations: 0,
        lastActive: new Date(),
      },
    });
    res.status(201).json(chatbot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chatbot' });
  }
});

// Update a chatbot
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;
  try {
    const chatbot = await prisma.chatbot.update({
      where: { id: parseInt(id) },
      data: { name, description, status },
    });
    res.json(chatbot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update chatbot' });
  }
});

// Delete a chatbot
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.chatbot.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chatbot' });
  }
});

module.exports = router;