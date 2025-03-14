const Benchmark = require('benchmark');
const app = require('../server');
const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const suite = new Benchmark.Suite;

suite
  .add('Chat API Response', {
    defer: true,
    fn: async (deferred) => {
      await request(app).post('/api/chat').send({ message: 'Hello' });
      deferred.resolve();
    }
  })
  .add('User Authentication', {
    defer: true,
    fn: async (deferred) => {
      await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123'
      });
      deferred.resolve();
    }
  })
  .add('Database Operations', {
    defer: true,
    fn: async (deferred) => {
      await prisma.$transaction([
        prisma.chat.findMany({ take: 10 }),
        prisma.user.findMany({ take: 10 })
      ]);
      deferred.resolve();
    }
  })
  .on('cycle', (event) => console.log(String(event.target)))
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
    prisma.$disconnect();
  })
  .run({ async: true });