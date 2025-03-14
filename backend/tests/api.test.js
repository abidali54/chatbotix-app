const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('API Endpoints', () => {
  beforeAll(async () => {
    // Setup test database if needed
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Authentication', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User'
        });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('Chatbot', () => {
    it('should return chatbot response', async () => {
      const res = await request(app)
        .post('/api/chatbot/message')
        .send({
          message: 'Hello'
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('response');
    });
  });

  describe('Analytics', () => {
    it('should return analytics data', async () => {
      const res = await request(app)
        .get('/api/analytics/overview');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
    });
  });
});

const request = require('supertest');
const app = require('../server');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('API Endpoints', () => {
  let authToken;

  beforeAll(async () => {
    await prisma.$connect();
    // Create test user
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    authToken = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Authentication', () => {
    it('should validate email format', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Test User'
        });
      expect(res.status).toBe(400);
    });

    it('should require strong password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: '123',
          name: 'Test User'
        });
      expect(res.status).toBe(400);
    });
  });

  describe('Chat API', () => {
    it('should handle long messages', async () => {
      const longMessage = 'Hello'.repeat(200);
      const res = await request(app)
        .post('/api/chat')
        .send({ message: longMessage });
      expect(res.status).toBe(400);
    });

    it('should maintain chat history', async () => {
      const res = await request(app)
        .get('/api/chat/history')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('Admin API', () => {
    it('should list backups with authentication', async () => {
      const res = await request(app)
        .get('/api/admin/backups')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.backups)).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should respond within acceptable time', async () => {
      const startTime = Date.now();
      await request(app)
        .post('/api/chat')
        .send({ message: 'Hello' });
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
