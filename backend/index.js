const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000' // Your frontend URL
}));
app.use(express.json());

// ... rest of your server code