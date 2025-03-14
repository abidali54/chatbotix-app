const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

class WhatsAppAdapter {
  constructor(config) {
    this.apiUrl = 'https://graph.facebook.com/v17.0';
    this.accessToken = config.accessToken;
    this.phoneNumberId = config.phoneNumberId;
  }

  async handleIncomingMessage(payload) {
    try {
      const { from, text, timestamp } = payload.entry[0].changes[0].value.messages[0];
      
      // Find or create conversation
      let conversation = await prisma.conversation.findFirst({
        where: {
          chatbot: {
            platform: 'WHATSAPP'
          },
          status: 'ACTIVE'
        }
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            status: 'ACTIVE',
            chatbot: {
              connect: {
                // Connect to appropriate chatbot based on your logic
                platform: 'WHATSAPP'
              }
            }
          }
        });
      }

      // Save incoming message
      await prisma.message.create({
        data: {
          content: text.body,
          type: 'INCOMING',
          conversationId: conversation.id
        }
      });

      return conversation;
    } catch (error) {
      console.error('Error handling WhatsApp message:', error);
      throw error;
    }
  }

  async sendMessage(to, message) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }
}

module.exports = WhatsAppAdapter;