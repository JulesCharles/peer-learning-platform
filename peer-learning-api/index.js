const express = require('express');
const axios = require('axios'); // Installer axios avec `npm install axios`
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from the Node.js API!');
});

app.get('/call-go', async (req, res) => {
  try {
    const response = await axios.get('http://backend-go:8081');
    res.send(`Response from Go backend: ${response.data}`);
  } catch (error) {
    res.status(500).send('Error connecting to Go backend');
  }
});

app.listen(3000, () => {
  console.log('API is running on port 3000');
});
