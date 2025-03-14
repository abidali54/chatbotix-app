const express = require('express');
const router = express.Router();
const WhatsAppAdapter = require('../adapters/whatsapp');
const MessengerAdapter = require('../adapters/messenger');
const InstagramAdapter = require('../adapters/instagram');

// Initialize platform adapters with configurations from environment variables
const whatsappAdapter = new WhatsAppAdapter({
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID
});

const messengerAdapter = new MessengerAdapter({
  accessToken: process.env.MESSENGER_ACCESS_TOKEN,
  pageId: process.env.MESSENGER_PAGE_ID
});

const instagramAdapter = new InstagramAdapter({
  accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
  pageId: process.env.INSTAGRAM_PAGE_ID
});

// WhatsApp webhook endpoint
router.post('/whatsapp', async (req, res) => {
  try {
    if (req.body.object === 'whatsapp_business_account') {
      const conversation = await whatsappAdapter.handleIncomingMessage(req.body);
      res.status(200).send('OK');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.sendStatus(500);
  }
});

// Messenger webhook endpoint
router.post('/messenger', async (req, res) => {
  try {
    if (req.body.object === 'page') {
      const conversation = await messengerAdapter.handleIncomingMessage(req.body);
      res.status(200).send('OK');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Messenger webhook error:', error);
    res.sendStatus(500);
  }
});

// Instagram webhook endpoint
router.post('/instagram', async (req, res) => {
  try {
    if (req.body.object === 'instagram') {
      const conversation = await instagramAdapter.handleIncomingMessage(req.body);
      res.status(200).send('OK');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Instagram webhook error:', error);
    res.sendStatus(500);
  }
});

// Verification endpoint for all platforms
router.get('/:platform', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

module.exports = router;