const WebSocket = require('ws');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // Map to store client connections
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws) => {
      console.log('New client connected');

      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          
          switch (data.type) {
            case 'auth':
              // Store the authenticated user's connection
              this.clients.set(data.userId, ws);
              break;

            case 'message':
              // Save message to database
              const savedMessage = await prisma.message.create({
                data: {
                  content: data.content,
                  type: data.messageType,
                  conversationId: data.conversationId
                }
              });

              // Broadcast message to all clients in the conversation
              this.broadcastToConversation(data.conversationId, {
                type: 'new_message',
                message: savedMessage
              });
              break;

            case 'takeover':
              // Update conversation status
              await prisma.conversation.update({
                where: { id: data.conversationId },
                data: { status: 'TRANSFERRED' }
              });

              // Notify all clients about the takeover
              this.broadcastToConversation(data.conversationId, {
                type: 'conversation_update',
                status: 'TRANSFERRED',
                agentId: data.userId
              });
              break;
          }
        } catch (error) {
          console.error('WebSocket message error:', error);
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
      });

      ws.on('close', () => {
        // Remove client from stored connections
        for (const [userId, client] of this.clients.entries()) {
          if (client === ws) {
            this.clients.delete(userId);
            break;
          }
        }
        console.log('Client disconnected');
      });
    });
  }

  broadcastToConversation(conversationId, data) {
    // Get all clients in the conversation
    const conversationClients = Array.from(this.clients.entries())
      .filter(([userId, client]) => {
        // Add logic to check if user is part of conversation
        return client.readyState === WebSocket.OPEN;
      })
      .map(([userId, client]) => client);

    // Broadcast message to all clients in the conversation
    conversationClients.forEach(client => {
      client.send(JSON.stringify(data));
    });
  }
}

module.exports = WebSocketServer;