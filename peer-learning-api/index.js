const express = require('express');
const axios = require('axios'); // Installer axios avec `npm install axios`
const jwt = require('jsonwebtoken'); // Installer JWT avec `npm install jsonwebtoken`
const authMiddleware = require('./authMiddleware'); // Utilisation du middleware
const app = express();

app.use(express.json()); // Pour parser le body en JSON

// Route de base pour tester l'API
app.get('/', (req, res) => {
  res.send('Hello from the Node.js API!');
});

// Appel au backend Go
app.get('/call-go', async (req, res) => {
  try {
    const response = await axios.get('http://backend-go:8081');
    res.send(`Response from Go backend: ${response.data}`);
  } catch (error) {
    res.status(500).send('Error connecting to Go backend');
  }
});

// Route d'inscription
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  // Logique pour inscrire un utilisateur (pour l'instant, pas de base de données)
  res.status(201).send(`User ${username} created successfully`);
});

// Route de connexion avec génération de JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Ici on suppose que l'utilisateur est authentifié
  const user = { id: 1, username }; // Ex: user trouvé en base de données
  const token = jwt.sign(user, 'secret_key'); // Génération du token JWT
  res.json({ token });
});

// Middleware pour protéger les routes avec JWT
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Route protégée (accessible seulement si JWT valide)
app.get('/protected', authenticateToken, (req, res) => {
  res.send(`This is a protected route. Welcome, ${req.user.username}`);
});

// Lancement de l'API sur le port 3000
app.listen(3000, () => {
  console.log('API is running on port 3000');
});
