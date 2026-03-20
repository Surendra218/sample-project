const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', async (req, res) => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users');
  const users = _.map(response.data, user => ({
    id: user.id,
    name: user.name,
    email: user.email
  }));
  res.json(users);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
