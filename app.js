const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from New Lambda!' });
});

app.get('/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }]);
});

module.exports = app;