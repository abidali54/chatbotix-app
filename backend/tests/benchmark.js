const Benchmark = require('benchmark');
const app = require('../server');
const request = require('supertest');

const suite = new Benchmark.Suite;

suite
  .add('Chat API Response Time', {
    defer: true,
    fn: async (deferred) => {
      await request(app)
        .post('/api/chat')
        .send({ message: 'Hello' });
      deferred.resolve();
    }
  })
  .add('Database Query Time', {
    defer: true,
    fn: async (deferred) => {
      await prisma.chat.findMany({ take: 10 });
      deferred.resolve();
    }
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Benchmark completed');
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ 'async': true });
  