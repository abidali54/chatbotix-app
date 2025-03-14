const { PrismaClient } = require('@prisma/client');
const axios = require('axios');

const prisma = new PrismaClient();

class InstagramAdapter {
  constructor(config) {
    this.apiUrl = 'https://graph.facebook.com/v17.0';
    this.accessToken = config.accessToken;
    this.pageId = config.pageId;
  }

  async handleIncomingMessage(payload) {
    try {
      const { sender, message } = payload.entry[0].messaging[0];
      
      // Find or create conversation
      let conversation = await prisma.conversation.findFirst({
        where: {
          chatbot: {
            platform: 'INSTAGRAM'
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
                platform: 'INSTAGRAM'
              }
            }
          }
        });
      }

      // Save incoming message
      await prisma.message.create({
        data: {
          content: message.text,
          type: 'INCOMING',
          conversationId: conversation.id
        }
      });

      return conversation;
    } catch (error) {
      console.error('Error handling Instagram message:', error);
      throw error;
    }
  }

  async sendMessage(recipientId, message) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${this.pageId}/messages`,
        {
          recipient: { id: recipientId },
          message: { text: message }
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
      console.error('Error sending Instagram message:', error);
      throw error;
    }
  }
}

module.exports = InstagramAdapter;