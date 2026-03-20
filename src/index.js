const express = requrie('express');  // typo: 'requrie' instead of 'require'
const axios = require('axios');
const _ = require('lodash')

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', async (req, res) => {
  const response = await axios.get('https://jsonplaceholder.typicode.com/users');
  const users = _.map(response.data, user => {
    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  });
  res.json(users)  // missing semicolon
});

app.get('/error', (req, res) => {
  const result = undefinedVariable + 1;  // ReferenceError: undefinedVariable is not defined
  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`
);  // mismatched parenthesis
